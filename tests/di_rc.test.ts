import { describe, it, expect } from 'vitest';
import { 
  createInitialState as createDIState, 
  submitAnswer as submitDIAnswer 
} from '../src/games/di/engine';
import { 
  createInitialState as createRCState, 
  submitAnswer as submitRCAnswer 
} from '../src/games/rc/engine';
import type { DIPuzzle } from '../src/games/di/types';
import type { RCPuzzle } from '../src/games/rc/types';

describe('Data Interpretation (DI) Engine', () => {
  const sampleDIPuzzle: DIPuzzle = {
    id: 'di_test_1',
    title: 'Company Sales Breakdown',
    tabs: [
      { id: 't1', title: 'Revenue', type: 'table', content: [] }
    ],
    questions: [
      {
        id: 'q1',
        statement: 'What was the percentage increase from Q1 to Q2?',
        options: ['10%', '15%', '20%', '25%'],
        correctAnswer: '20%',
        explanation: 'Calculation: (120 - 100) / 100 = 20%'
      },
      {
        id: 'q2',
        statement: 'Which quarter had the lowest expenditure?',
        options: ['Q1', 'Q2', 'Q3', 'Q4'],
        correctAnswer: 'Q1',
        explanation: 'Q1 had minimum costs.'
      }
    ]
  };

  it('initializes playing state at question index 0 with score 0', () => {
    const state = createDIState(sampleDIPuzzle);
    expect(state.status).toBe('playing');
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.score).toBe(0);
    expect(state.answers).toEqual({});
  });

  it('increments score on correct answer and advances question index', () => {
    let state = createDIState(sampleDIPuzzle);
    state = submitDIAnswer(state, '20%'); // Correct for Q1

    expect(state.score).toBe(1);
    expect(state.currentQuestionIndex).toBe(1);
    expect(state.status).toBe('playing');
  });

  it('does not increment score on incorrect answer but advances', () => {
    let state = createDIState(sampleDIPuzzle);
    state = submitDIAnswer(state, '10%'); // Incorrect for Q1

    expect(state.score).toBe(0);
    expect(state.currentQuestionIndex).toBe(1);
  });

  it('completes game after answering the final question', () => {
    let state = createDIState(sampleDIPuzzle);
    state = submitDIAnswer(state, '20%'); // Q1 Correct
    state = submitDIAnswer(state, 'Q1');  // Q2 Correct

    expect(state.score).toBe(2);
    expect(state.status).toBe('completed');
  });
});

describe('Reading Comprehension (RC) Engine', () => {
  const sampleRCPuzzle: RCPuzzle = {
    id: 'rc_test_1',
    passage: 'Artificial intelligence is transforming software engineering methodologies...',
    questions: [
      {
        id: 'rc_q1',
        statement: 'What is the primary theme of the passage?',
        options: ['AI impact on engineering', 'Hardware advancement', 'Robotics history'],
        correctAnswer: 'AI impact on engineering',
        explanation: 'Directly stated in paragraph 1.'
      }
    ]
  };

  it('initializes RC state and records answers', () => {
    let state = createRCState(sampleRCPuzzle);
    expect(state.status).toBe('playing');
    expect(state.currentQuestionIndex).toBe(0);

    state = submitRCAnswer(state, 'AI impact on engineering');
    expect(state.score).toBe(1);
    expect(state.status).toBe('completed');
  });
});

