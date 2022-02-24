interface WsInstance {
  ws: WebSocket;
  event: string;
}
export interface BinanceKLine {
  e: string;
  E: number;
  s: string;
  k: {
    t: number; // Kline start time
    T: number;
    s: string;
    i: string;
    f: number;
    L: number;
    /**
     * Opening price
     */
    o: string;
    /**
     * Current price
     */
    c: string;
    h: string;
    l: string;
    v: string;
    n: number;
    x: boolean;
    q: string;
    V: string;
    Q: string;
    B: string;
  };
}

export class SocketClient {
  baseUrl = 'wss://stream.binance.com:9443/';
  listWs: WsInstance[] = [];
  on(path: string, cb: (data: any) => void) {
    path = `ws/${path}`;
    const event = `${this.baseUrl}${path}`;
    const ws = new WebSocket(event);
    ws.onmessage = (msg) => {
      const message = JSON.parse(msg.data as string);
      cb(message);
    };
    this.listWs.push({
      event,
      ws,
    });
  }

  closeSocket() {
    for (const wsInstance of this.listWs) {
      wsInstance.ws.close();
    }
    this.listWs = [];
  }
}
