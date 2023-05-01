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
  data?: ResponseData | string;
};

export type ResponseData = {
  prompt?: string;
  actor?: ChatCompletionRequestMessage;
  crowd?: CrowdResponse;
  critic?: CriticResponse;
};

export type CriticResponse = {
  scores: {
    humor: number;
    originality: number;
    relevance: number;
    overall: number;
  };
  feedback: string;
};

export type CrowdResponse = {
  feedback: string;
  scores: {
    humor: number;
    relevance: number;
  };
};

export class WebSocketClient {
  private socket: WebSocket | null = null;
  private uuid = "";
  private reconnectInterval: number;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private url: string, reconnectInterval = 5000) {
    this.reconnectInterval = reconnectInterval;
  }

  public connect(): void {
    this.socket = new WebSocket(this.url);

    this.socket.addEventListener("open", (event) => {
      this.clearReconnectTimeout();
      console.log("WebSocket connection opened:", event);
      const newConnectionMessage: WebsocketMessage = {
        event: WebsocketEvents.CONNECT,
      };
      this.socket?.send(JSON.stringify(newConnectionMessage));
    });

    this.socket.addEventListener("message", (event) => {
      console.log("WebSocket message received:", event);
      const data = JSON.parse(event.data as string) as WebsocketMessage;
      if (!data.data) {
        throw new Error(
          "Looks like something went wrong communicating with the server, please try refreshing your page"
        );
      }
      if (data.event === WebsocketEvents.CONNECT) {
        this.uuid = data.data as string;
        console.log("CONNECT from server: ", this.uuid);
      } else if (data.event === WebsocketEvents.NEW_GAME) {
        const response: ResponseData = data.data;
        GameState.newGameResponse(
          response.prompt ||
            "Sorry looks like something went wrong, refresh the page"
        );
      } else if (data.event === WebsocketEvents.MESSAGE) {
        console.log("MESSAGE from server: ", data.data);
        const response: ResponseData = data.data;
        const actorMessage: ChatCompletionRequestMessage = response.actor;
        const crowdMessage: CrowdResponse = response.crowd;
        GameState.response(actorMessage);
        GameState.crowd(crowdMessage);
      } else if (data.event === WebsocketEvents.FINISHED) {
        console.log("FINISHED from server: ", data.data);
        const response: ResponseData = data.data;
        const criticMessage: CriticResponse = response.critic;
        const crowdMessage: CrowdResponse = response.crowd;
        GameState.crowd(crowdMessage);
        GameState.endGame(criticMessage);
      }
    });

    this.socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
      this.scheduleReconnect();
    });

    this.socket.addEventListener("error", (event) => {
      console.log("WebSocket error:", event);
      this.scheduleReconnect();
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

  private scheduleReconnect(): void {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        console.log("Attempting to reconnect...");
        this.connect();
      }, this.reconnectInterval);
    }
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
      window.location.reload();
    }
  }
}

let wsClient: WebSocketClient | null = null;
export function getSocket(): WebSocketClient {
  if (!wsClient) {
    wsClient = new WebSocketClient("wss://ludum-dare-53-backend.herokuapp.com");
    wsClient.connect();
    //
  }
  return wsClient;
}
