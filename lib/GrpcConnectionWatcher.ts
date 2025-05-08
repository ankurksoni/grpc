import * as grpc from '@grpc/grpc-js';
import { EventEmitter } from 'events';

export enum ConnectionState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  READY = 'READY',
  TRANSIENT_FAILURE = 'TRANSIENT_FAILURE',
  SHUTDOWN = 'SHUTDOWN'
}

export interface ConnectionWatcherOptions {
  checkInterval?: number;
  maxRetries?: number;
  retryDelay?: number;
}

export class GrpcConnectionWatcher extends EventEmitter {
  private client: any;
  private checkInterval: number;
  private maxRetries: number;
  private retryDelay: number;
  private retryCount: number = 0;
  private watcherInterval?: NodeJS.Timeout;
  private currentState: ConnectionState = ConnectionState.IDLE;

  constructor(
    client: any,
    options: ConnectionWatcherOptions = {}
  ) {
    super();
    this.client = client;
    this.checkInterval = options.checkInterval || 3000;
    this.maxRetries = options.maxRetries || -1; // -1 means infinite retries
    this.retryDelay = options.retryDelay || 1000;
  }

  public start(): void {
    if (this.watcherInterval) {
      return;
    }

    this.watcherInterval = setInterval(() => {
      this.checkConnection();
    }, this.checkInterval);

    // Initial check
    this.checkConnection();
  }

  public stop(): void {
    if (this.watcherInterval) {
      clearInterval(this.watcherInterval);
      this.watcherInterval = undefined;
    }
    this.currentState = ConnectionState.SHUTDOWN;
    this.emit('stateChanged', this.currentState);
  }

  private checkConnection(): void {
    console.log('Checking connection...');
    try {
      const channel = this.client.getChannel();
      const newState = this.mapGrpcState(
        channel.getConnectivityState(true)
      );
      console.log(this.currentState, ' ---> ', newState);
      if (newState !== this.currentState) {
        this.handleStateChange(newState);
      }

      // Reset retry count on successful connection
      if (newState === ConnectionState.READY) {
        this.retryCount = 0;
      }

    } catch (error) {
      this.emit('error', error);
      this.handleStateChange(ConnectionState.TRANSIENT_FAILURE);
    }
  }

  private handleStateChange(newState: ConnectionState): void {
    this.currentState = newState;
    this.emit('stateChanged', newState);

    if (newState === ConnectionState.TRANSIENT_FAILURE) {
      this.handleReconnection();
    }
  }

  private async handleReconnection(): Promise<void> {
    if (this.maxRetries !== -1 && this.retryCount >= this.maxRetries) {
      this.emit('maxRetriesReached');
      return;
    }

    this.retryCount++;
    this.emit('reconnecting', this.retryCount);

    await new Promise(resolve => setTimeout(resolve, this.retryDelay));

    try {
      const channel = this.client.getChannel();
      channel.connectivityState = grpc.connectivityState.IDLE;
      this.emit('reconnected');
    } catch (error) {
      this.emit('error', error);
    }
  }

  private mapGrpcState(state: grpc.connectivityState): ConnectionState {
    const stateMap: Record<grpc.connectivityState, ConnectionState> = {
      [grpc.connectivityState.IDLE]: ConnectionState.IDLE,
      [grpc.connectivityState.CONNECTING]: ConnectionState.CONNECTING,
      [grpc.connectivityState.READY]: ConnectionState.READY,
      [grpc.connectivityState.TRANSIENT_FAILURE]: ConnectionState.TRANSIENT_FAILURE,
      [grpc.connectivityState.SHUTDOWN]: ConnectionState.SHUTDOWN
    };
    return stateMap[state];
  }

  public getCurrentState(): ConnectionState {
    return this.currentState;
  }
} 