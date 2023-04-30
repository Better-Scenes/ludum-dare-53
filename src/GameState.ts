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
      messages: [],
    };
    this.game = gameData;
    getSocket().startNewGame(prompt);
    return prompt;
  }

  public newMessage(message: string) {
    this.game.messages.push(message);
    //redraw UI because we have a new message
    getSocket().sendMessage(message);
  }

  public response(message: ChatCompletionRequestMessage) {
    this.game.messages.push(message);
    if (this.stateChangeCallback) {
      this.stateChangeCallback();
    }
  }
}

const GameState: GameStateClass = new GameStateClass();
export default GameState;
