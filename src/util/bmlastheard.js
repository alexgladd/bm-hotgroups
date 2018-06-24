// wrapper for listening to Brandmeister's 'Last Heard' stream

import io from 'socket.io-client';

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

  _onConnect() {
    this.connected = true;
    console.log(`[BMLH] successfully connected to ${this.url}`);
  }

  _onConnectError(err) {
    this.connected = false;
    console.error(`[BMLH] unable to (re)connect to ${this.url}`, err);
  }

  _onConnectTimeout() {
    this.connected = false;
    console.error(`[BMLH] connect timeout to ${this.url}`);
  }

  _onDisconnect(reason) {
    this.connected = false;
    console.log(`[BMLH] disconnected from ${this.url}`);
  }

  _onReconnect() {
    this.connected = true;
    console.log(`[BMLH] successfully reconnected to ${this.url}`);
  }

  _onReconnecting(attempt) {
    this.connected = false;
    console.log(`[BMLH] attempting to reconnect to ${this.url} (${attempt})`);
  }

  _onReconnectFailed() {
    this.connected = false;
    console.error(`[BMLH] failed to reconnect to ${this.url}`);
  }

  _onError(err) {
    console.error(`[BMLH] socket error on ${this.url}`, err);
  }
}

export default BrandmeisterLastHeard;
