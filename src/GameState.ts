import { getSocket } from "./websockets";

export type ChatCompletionRequestMessage = {
  role: string;
  content: string;
  name?: string;
};

export type GameCriticism = {
  scores: {
    humor: number;
    originality: number;
    relevance: number;
    overall: number;
  };
  feedback: string;
};

export type GameData = {
  prompt?: string;
  messages: (string | ChatCompletionRequestMessage)[];
  critic?: GameCriticism;
};

class GameStateClass {
  private game: GameData;
  private stateChangeCallback?: () => void;

  constructor() {
    this.game = { messages: [] };
  }

  public getState(): GameData {
    return this.game;
  }

  public startNewGame(stateChangeCallback?: () => void) {
    this.stateChangeCallback = stateChangeCallback;

    //get or generate prompt
    const prompt =
      "You are a cavewoman, you are trying to explain to your boyfriend that you are pregnant";
    const gameData: GameData = {
      prompt,
      messages: ["i am the player and I write this thing", { content: "response", role: ""}, "another response!"],
    };
    gameData.critic = {
      scores: {
        humor: 6,
        originality: 5,
        relevance: 8,
        overall: 6,
      },
      feedback:
        "The Actor stuck to the prompt, but their lines were a bit predictable. A decent effort, but lacked the spark needed to stand out.",
    };
    this.game = gameData;
    getSocket().startNewGame(prompt);
    return prompt;
  }

  public newGameResponse(prompt: string) {
    this.game.prompt = prompt;
  }

  public newMessage(message: string) {
    this.game.messages.push(message);
    getSocket().sendMessage(message);
  }

  // send final message from player to server
  public finalMessage(message: string) {
    this.game.messages.push(message);
    getSocket().endGame(message);
  }

  public response(message: ChatCompletionRequestMessage) {
    this.game.messages.push(message);
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }
  }

  //got "FINISHED" message from server so update critic state
  public endGame(criticMessage: GameCriticism) {
    this.game.critic = criticMessage;
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }
  }
}

const GameState: GameStateClass = new GameStateClass();
export default GameState;
