export type RCAnswer = string;

export interface RCTab {
  id: string;
  title: string;
  content: string; // Plain text or markdown
}

export interface RCQuestion {
  id: string;
  statement: string;
  options: string[];
  correctAnswer: RCAnswer;
  explanation: string;
}

export interface RCPuzzle {
  id: string;
  title: string;
  tabs: RCTab[];
  questions: RCQuestion[];
}

export interface RCState {
  puzzle: RCPuzzle;
  currentQuestionIndex: number;
  status: "playing" | "completed";
  score: number;
  answers: Record<string, RCAnswer>;
}
