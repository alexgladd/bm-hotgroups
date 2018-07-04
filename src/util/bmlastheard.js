// wrapper for listening to Brandmeister's 'Last Heard' stream

import io from 'socket.io-client';
import log from './logger';

const BM_DEFAULT_URL = 'https://api.brandmeister.network';
const BM_DEFAULT_OPTS = {
  path: '/lh',
  reconnection: true
};

class BrandmeisterLastHeard {
  constructor(url=BM_DEFAULT_URL, options=BM_DEFAULT_OPTS) {
    this.connected = false;
    this.url = url;
    this.options = { ...options, autoConnect: false };
    this.handleConnectChange = () => { return; };

    this.socket = io(this.url, this.options);

    // default event handlers
    this.socket.on('connect', this._onConnect.bind(this));
    this.socket.on('connect_error', this._onConnectError.bind(this));
    this.socket.on('connect_timeout', this._onConnectTimeout.bind(this));
    this.socket.on('disconnect', this._onDisconnect.bind(this));
    this.socket.on('reconnect', this._onReconnect.bind(this));
    this.socket.on('reconnecting', this._onReconnecting.bind(this));
    this.socket.on('reconnect_error', this._onConnectError.bind(this));
    this.socket.on('reconnect_failed', this._onReconnectFailed.bind(this));
    this.socket.on('error', this._onError.bind(this));
  }

  get isConnected() {
    return this.connected;
  }

  open() {
    this.socket.open();
  }

  close() {
    this.socket.close();
  }

  onMqtt(handler, replace=true, filter=(msg) => true) {
    if (replace) {
      this.socket.off('mqtt');
    }

    this.socket.on('mqtt', (msg) => {
      const lhMsg = JSON.parse(msg.payload);
      if (filter(lhMsg)) handler(lhMsg);
    });
  }

  onConnectionChange(handler=(connectState) => { return; }) {
    if (typeof handler !== 'function') {
      return;
    }

    this.handleConnectChange = handler;
  }

  _onConnect() {
    log(`[BMLH] successfully connected to ${this.url}`);
    this.connected = true;
    this.handleConnectChange(this.connected);
  }

  _onConnectError(err) {
    console.error(`[BMLH] unable to (re)connect to ${this.url}`, err);
    this.connected = false;
    this.handleConnectChange(this.connected);
  }

  _onConnectTimeout() {
    console.error(`[BMLH] connect timeout to ${this.url}`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  }

  _onDisconnect(reason) {
    log(`[BMLH] disconnected from ${this.url}`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  }

  _onReconnect() {
    log(`[BMLH] successfully reconnected to ${this.url}`);
    this.connected = true;
    this.handleConnectChange(this.connected);
  }

  _onReconnecting(attempt) {
    log(`[BMLH] attempting to reconnect to ${this.url} (${attempt})`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  }

  _onReconnectFailed() {
    console.error(`[BMLH] failed to reconnect to ${this.url}`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  }

  _onError(err) {
    console.error(`[BMLH] socket error on ${this.url}`, err);
  }
}

export default BrandmeisterLastHeard;
