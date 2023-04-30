import GameState, { ChatCompletionRequestMessage, GameData } from "./GameState";

export enum WebsocketEvents {
  CONNECT = "CONNECT", // user is connecting or server is responding with uuid
  NEW_GAME = "NEW_GAME", // when the user is starting a new game
  MESSAGE = "MESSAGE", // message from the user, e.g sending their prompt
  FINISHED = "FINISHED", // for finishing the game, includes final prompt, or feedback from critic
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
      const newConnectionMessage: WebsocketMessage = {
        event: WebsocketEvents.CONNECT,
      };
      this.socket?.send(JSON.stringify(newConnectionMessage));
    });

    this.socket.addEventListener("message", (event) => {
      console.log("WebSocket message received:", event);
      const data = JSON.parse(event.data as string) as WebsocketMessage;
      if (data.event === WebsocketEvents.CONNECT) {
        this.uuid = data.data as string;
        console.log("CONNECT from server: ", this.uuid);
      } else if (data.event === WebsocketEvents.NEW_GAME) {
        console.log("new game prompt: ", data.data);
      } else if (data.event === WebsocketEvents.MESSAGE) {
        console.log("MESSAGE from server: ", data.data);
        const responseMessage: ChatCompletionRequestMessage = data.data;
        GameState.response(responseMessage);
      } else if (data.event === WebsocketEvents.FINISHED) {
        console.log("FINISHED from server: ", data.data);
        const responseMessage: ChatCompletionRequestMessage = data.data;
        GameState.response(responseMessage);
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
      const newUserMessage: WebsocketMessage = {
        event: WebsocketEvents.MESSAGE,
        uuid: this.uuid,
        data: message,
      };
      this.socket?.send(JSON.stringify(newUserMessage));
    } else {
      console.log("WebSocket is not connected");
    }
  }

  public endGame(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const newUserMessage: WebsocketMessage = {
        event: WebsocketEvents.FINISHED,
        uuid: this.uuid,
        data: message,
      };
      this.socket?.send(JSON.stringify(newUserMessage));
    } else {
      console.log("WebSocket is not connected");
    }
  }

  public startNewGame(prompt = ""): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const newGameMessage: WebsocketMessage = {
        event: WebsocketEvents.NEW_GAME,
        uuid: this.uuid,
        data: prompt,
      };
      this.socket?.send(JSON.stringify(newGameMessage));
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
