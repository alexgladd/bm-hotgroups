import { io, type Socket } from "socket.io-client";

const BM_DEFAULT_URL = "https://api.brandmeister.network";
const BM_DEFAULT_OPTS = {
  autoConnect: false,
  path: "/lh",
  transports: ["websocket", "polling"],
  secure: true,
  reconnection: true,
};

export type FnConnectionChange = (connected: boolean) => void;
export type FnMsgFilter = (msg: object) => boolean;
export type FnMsgHandler = (msg: object) => void;
export type LhMsg = {
  topic: "LH-Startup" | "LH";
  payload: string;
};

class BrandmeisterLastHeard {
  private connected = false;
  private handleConnectChange: FnConnectionChange = () => {};
  private url = BM_DEFAULT_URL;
  private options = BM_DEFAULT_OPTS;
  private socket: Socket;

  constructor() {
    this.socket = io(this.url, this.options);

    // default event handlers
    this.socket.on("connect", this._onConnect);
    this.socket.on("connect_error", this._onConnectError);
    this.socket.on("connect_timeout", this._onConnectTimeout);
    this.socket.on("disconnect", this._onDisconnect);
    this.socket.on("reconnect", this._onReconnect);
    this.socket.on("reconnect_attempt", this._onReconnecting);
    this.socket.on("reconnect_error", this._onConnectError);
    this.socket.on("reconnect_failed", this._onReconnectFailed);
    this.socket.on("error", this._onError);
  }

  get isConnected() {
    return this.connected;
  }

  open(this: BrandmeisterLastHeard) {
    this.socket.open();
  }

  close(this: BrandmeisterLastHeard) {
    this.socket.close();
  }

  onConnectionChange(
    this: BrandmeisterLastHeard,
    handler: FnConnectionChange | null | undefined
  ) {
    if (handler) {
      this.handleConnectChange = handler;
    } else {
      this.handleConnectChange = () => {};
    }
  }

  onMsg(
    this: BrandmeisterLastHeard,
    handler: FnMsgHandler,
    filter?: FnMsgFilter,
    replace = true
  ) {
    if (replace) {
      this.socket.off("mqtt");
    }

    this.socket.on("mqtt", (msg: LhMsg) => {
      const lhMsg = JSON.parse(msg.payload);
      if (!filter || filter(lhMsg)) handler(lhMsg);
    });
  }

  dropListeners(this: BrandmeisterLastHeard) {
    this.socket.off("mqtt");
    this.handleConnectChange = () => {};
  }

  _onConnect = () => {
    console.log(`[BMLH] successfully connected to ${this.url}`);
    this.connected = true;
    this.handleConnectChange(this.connected);
  };

  _onConnectError = (err: Error) => {
    console.error(`[BMLH] unable to (re)connect to ${this.url}`, err);
    this.connected = false;
    this.handleConnectChange(this.connected);
  };

  _onConnectTimeout = () => {
    console.error(`[BMLH] connection timeout to ${this.url}`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  };

  _onDisconnect = (reason: Socket.DisconnectReason) => {
    console.log(`[BMLH] disconnected from ${this.url}: ${reason}`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  };

  _onReconnect = () => {
    console.log(`[BMLH] successfully reconnected to ${this.url}`);
    this.connected = true;
    this.handleConnectChange(this.connected);
  };

  _onReconnecting = (attempt: number) => {
    console.log(
      `[BMLH] attempting to reconnect to ${this.url} (attempt ${attempt})`
    );
    this.connected = false;
    this.handleConnectChange(this.connected);
  };

  _onReconnectFailed = () => {
    console.error(`[BMLH] failed to reconnect to ${this.url}`);
    this.connected = false;
    this.handleConnectChange(this.connected);
  };

  _onError(err: Error) {
    console.error(`[BMLH] socket error on ${this.url}`, err);
  }
}

export default BrandmeisterLastHeard;
