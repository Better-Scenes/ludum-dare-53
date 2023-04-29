export enum WebsocketEvents {
  CONNECT = "CONNECT", // user is connecting or server is responding with uuid
  NEW_GAME = "NEW_GAME", // when the user is starting a new game
  MESSAGE = "MESSAGE", // message from the user, e.g sending their prompt
}
export type WebsocketMessage = {
  event: WebsocketEvents;
  uuid?: string; //unique identifier from client
  data?: object | string;
};

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private uuid = "";

  constructor(private url: string) {}

  public connect(): void {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
      // You can send a message to the server after the connection is established
      this.sendMessage(JSON.stringify({ event: WebsocketEvents.CONNECT }));
    });

    this.socket.addEventListener("message", (event) => {
      console.log("WebSocket message received:", event);
      const data = JSON.parse(event.data as string) as WebsocketMessage;
      if (data.event === WebsocketEvents.CONNECT) {
        this.uuid = data.data as string;
        const newGameMessage: WebsocketMessage = {
          event: WebsocketEvents.NEW_GAME,
          uuid: this.uuid,
        };
        this.socket?.send(JSON.stringify(newGameMessage));
      } else if (data.event === WebsocketEvents.NEW_GAME) {
        console.log("new game prompt: ", data.data);
      }
    });

    this.socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });

    this.socket.addEventListener("error", (event) => {
      console.log("WebSocket error:", event);
    });
  }

  public sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log("WebSocket is not connected");
    }
  }
}

let wsClient: WebSocketClient | null = null;
export function getSocket(): WebSocketClient {
  if (!wsClient) {
    wsClient = new WebSocketClient("ws://localhost:8080");
    wsClient.connect();
  }
  return wsClient;
}
