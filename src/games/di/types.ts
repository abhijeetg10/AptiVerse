export type DIAnswer = "True" | "False" | "Cannot Say";

export interface DataTab {
  id: string;
  title: string;
  type: "table" | "text" | "list";
  content: any; // Flexible content based on type
}

export interface DIQuestion {
  id: string;
  statement: string;
  correctAnswer: DIAnswer;
  explanation: string;
}

export interface DIPuzzle {
  id: string;
  title: string;
  tabs: DataTab[];
  questions: DIQuestion[];
}

export interface DIState {
  puzzle: DIPuzzle;
  currentQuestionIndex: number;
  status: "playing" | "completed";
  score: number;
  answers: Record<string, DIAnswer>; // questionId -> answer
}
