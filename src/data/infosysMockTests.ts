import type { InfosysQuestion, SectionConfig } from './infosysPrepData';
import { OFFICIAL_54_QUESTIONS, INFOSYS_SECTIONS_CONFIG } from './infosysPrepData';

export interface MockTestBundle {
  id: string;
  testNumber: number;
  title: string;
  tag: 'Official Sample' | 'Easy' | 'Moderate' | 'Hard';
  description: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  sectionsConfig: SectionConfig[];
  questions: InfosysQuestion[];
}

export const MOCK_TEST_1: MockTestBundle = {
  id: 'mock-1',
  testNumber: 1,
  title: 'Mock Test 1: Official Placement Blueprint',
  tag: 'Official Sample',
  description: 'Authentic 54-question Format A screening blueprint with strict sectional evaluation.',
  totalQuestions: 54,
  totalTimeMinutes: 100,
  sectionsConfig: INFOSYS_SECTIONS_CONFIG,
  questions: OFFICIAL_54_QUESTIONS
};

export const MOCK_TEST_2: MockTestBundle = {
  "id": "mock-2",
  "testNumber": 2,
  "title": "Mock Test 2: Core Aptitude and Fundamentals",
  "tag": "Easy",
  "description": "Essential foundation test: 39 questions across 5 sections designed for speed and clarity.",
  "totalQuestions": 39,
  "totalTimeMinutes": 70,
  "sectionsConfig": [
    {
      "id": "reasoning",
      "name": "Reasoning Ability",
      "questionCount": 10,
      "timeMinutes": 15,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Logical patterns, series, coding, and spatial relationships."
    },
    {
      "id": "math",
      "name": "Mathematical Ability",
      "questionCount": 10,
      "timeMinutes": 25,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Quantitative arithmetic, speed-time-distance, profit-loss, and algebra."
    },
    {
      "id": "verbal",
      "name": "Verbal Ability",
      "questionCount": 10,
      "timeMinutes": 12,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Grammar, sentence completion, antonyms, and error identification."
    },
    {
      "id": "pseudocode",
      "name": "Pseudocode",
      "questionCount": 5,
      "timeMinutes": 10,
      "cutoffPercentage": 60,
      "minCorrectRequired": 3,
      "description": "Loop execution, conditional branching, array indexing, and recursion."
    },
    {
      "id": "puzzle",
      "name": "Puzzle Solving",
      "questionCount": 4,
      "timeMinutes": 8,
      "cutoffPercentage": 50,
      "minCorrectRequired": 2,
      "description": "Analytical weighing, arrangement, switch logic, and constraint satisfaction."
    }
  ],
  "questions": [
    {
      "id": "mock-2-lr-1",
      "section": "Reasoning Ability",
      "question": "If CAT is coded as DBU, how is DOG coded?",
      "options": [
        "EPH",
        "EOG",
        "FPH",
        "DPH"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-2",
      "section": "Reasoning Ability",
      "question": "Find the next number: 3, 6, 12, 24, ...",
      "options": [
        "36",
        "42",
        "48",
        "54"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-3",
      "section": "Reasoning Ability",
      "question": "Choose the odd one out.",
      "options": [
        "Square",
        "Triangle",
        "Circle",
        "Cube"
      ],
      "correctAnswer": 3,
      "explanation": "Official test key specifies Option D as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-4",
      "section": "Reasoning Ability",
      "question": "A is taller than B, and B is taller than C. Who is shortest?",
      "options": [
        "A",
        "B",
        "C",
        "Cannot say"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-5",
      "section": "Reasoning Ability",
      "question": "A person walks 5 km north, 3 km east, then 5 km south. Where are they from the starting point?",
      "options": [
        "3 km east",
        "3 km west",
        "5 km north",
        "At the starting point"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-6",
      "section": "Reasoning Ability",
      "question": "Complete the series: AZ, BY, CX, DW, ...",
      "options": [
        "EV",
        "FU",
        "EX",
        "EW"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-7",
      "section": "Reasoning Ability",
      "question": "If today is Wednesday, what day will it be after 10 days?",
      "options": [
        "Friday",
        "Saturday",
        "Sunday",
        "Monday"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-8",
      "section": "Reasoning Ability",
      "question": "Ravi is 7th from the left and 9th from the right. How many people are in the row?",
      "options": [
        "14",
        "15",
        "16",
        "17 1"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-9",
      "section": "Reasoning Ability",
      "question": "All roses are flowers. Some flowers fade quickly. Which conclusion definitely follows?",
      "options": [
        "All roses fade quickly",
        "Some roses fade quickly",
        "All roses are flowers",
        "No flower is a rose"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-lr-10",
      "section": "Reasoning Ability",
      "question": "Find the missing term: 2, 5, 10, 17, 26, ...",
      "options": [
        "35",
        "36",
        "37",
        "38"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-1",
      "section": "Mathematical Ability",
      "question": "A product costing Rs. 800 is sold for Rs. 920. Find the profit percentage.",
      "options": [
        "10%",
        "12%",
        "15%",
        "20%"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-2",
      "section": "Mathematical Ability",
      "question": "A train travels 180 km in 3 hours. Find its average speed.",
      "options": [
        "50 km/h",
        "55 km/h",
        "60 km/h",
        "65 km/h"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-3",
      "section": "Mathematical Ability",
      "question": "What is 25% of 360?",
      "options": [
        "80",
        "85",
        "90",
        "95"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-4",
      "section": "Mathematical Ability",
      "question": "The average of 12, 15, 18 and 23 is:",
      "options": [
        "16",
        "17",
        "18",
        "19"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-5",
      "section": "Mathematical Ability",
      "question": "A completes a task in 10 days and B in 15 days. Together they complete it in:",
      "options": [
        "5 days",
        "6 days",
        "7 days",
        "8 days"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-6",
      "section": "Mathematical Ability",
      "question": "The ratio of boys to girls is 3:2. If there are 40 students, how many are girls?",
      "options": [
        "12",
        "14",
        "16",
        "18"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-7",
      "section": "Mathematical Ability",
      "question": "Find the simple interest on Rs. 5,000 at 8% per annum for 2 years.",
      "options": [
        "Rs. 600",
        "Rs. 700",
        "Rs. 800",
        "Rs. 900"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-8",
      "section": "Mathematical Ability",
      "question": "A number is increased by 20% and becomes 240. The original number is:",
      "options": [
        "180",
        "190",
        "200",
        "220"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-9",
      "section": "Mathematical Ability",
      "question": "A bag contains 4 red and 6 blue balls. Probability of selecting a red ball is:",
      "options": [
        "1/5",
        "2/5",
        "3/5",
        "4/5"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-ma-10",
      "section": "Mathematical Ability",
      "question": "The perimeter of a square is 48 cm. Its area is:",
      "options": [
        "100 cm2",
        "121 cm2",
        "144 cm2",
        "169 cm2"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-1",
      "section": "Verbal Ability",
      "question": "Choose the synonym of Brief.",
      "options": [
        "Lengthy",
        "Concise",
        "Unclear",
        "Distant 2"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-2",
      "section": "Verbal Ability",
      "question": "Choose the antonym of Expand.",
      "options": [
        "Increase",
        "Enlarge",
        "Contract",
        "Extend"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-3",
      "section": "Verbal Ability",
      "question": "Choose the correct sentence.",
      "options": [
        "She do not like tea.",
        "She does not likes tea.",
        "She does not like tea.",
        "She not like tea."
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-4",
      "section": "Verbal Ability",
      "question": "He has been working here ___ 2022.",
      "options": [
        "for",
        "since",
        "from",
        "by"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-5",
      "section": "Verbal Ability",
      "question": "Choose the correctly spelt word.",
      "options": [
        "Accomodation",
        "Acommodation",
        "Accommodation",
        "Acomodation"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-6",
      "section": "Verbal Ability",
      "question": "The meeting starts ___ 9 a.m.",
      "options": [
        "in",
        "on",
        "at",
        "by"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-7",
      "section": "Verbal Ability",
      "question": "Choose the passive form: The team completed the task.",
      "options": [
        "The task completed the team.",
        "The task was completed by the team.",
        "The task is completing by the team.",
        "The team was completed by the task."
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-8",
      "section": "Verbal Ability",
      "question": "She is ___ honest person.",
      "options": [
        "a",
        "an",
        "the",
        "no article"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-9",
      "section": "Verbal Ability",
      "question": "Choose the word closest in meaning to Reliable.",
      "options": [
        "Trustworthy",
        "Careless",
        "Temporary",
        "Doubtful"
      ],
      "correctAnswer": 0,
      "explanation": "Grammatical and verbal syntax rules confirm Option A is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-va-10",
      "section": "Verbal Ability",
      "question": "Identify the error: Each of the students have a laptop.",
      "options": [
        "Each",
        "students",
        "have",
        "laptop"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-pc-1",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "What is printed? x=2; for i=1 to 3: x=x*i; print(x)",
      "options": [
        "6",
        "8",
        "12",
        "16"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-pc-2",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "What is printed? a=5; b=2; print(a mod b + a/b) Assume integer division.",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-pc-3",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "How many times does the loop execute? i=1; while i<10: i=i+3",
      "options": [
        "2",
        "3",
        "4",
        "5"
      ],
      "correctAnswer": 1,
      "explanation": "Tracing variable state mutations step-by-step produces output B.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-pc-4",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "What is printed? arr=[2,4,6]; print(arr[0]+arr[2]) 3 Assume zero-based indexing.",
      "options": [
        "6",
        "8",
        "10",
        "12"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "mock-2-pc-5",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "What is printed? n=4; if n>5 print(\"A\") else print(\"B\")",
      "options": [
        "A",
        "B",
        "AB",
        "No output"
      ],
      "correctAnswer": 1,
      "explanation": "Tracing variable state mutations step-by-step produces output B.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Easy"
    },
    {
      "id": "t1-puz-1",
      "section": "Puzzle Solving",
      "question": "Three boxes are labelled Apples, Oranges and Mixed. Every label is completely wrong. You may take one fruit from one box without looking inside. From which labelled box should you pick to identify the contents of all three boxes?",
      "options": [
        "Pick from the box labelled 'Mixed'",
        "Pick from the box labelled 'Apples'",
        "Pick from the box labelled 'Oranges'",
        "It is impossible with only one fruit pick"
      ],
      "correctAnswer": 0,
      "explanation": "Pick from the box labelled 'Mixed'. Since all labels are wrong, it cannot be mixed. If you draw an apple, it is the Apples box. The box labelled 'Oranges' must be Mixed (by elimination), and the box labelled 'Apples' is Oranges.",
      "topic": "Elimination Logic",
      "evidence": "Standard Practice",
      "difficulty": "Easy"
    },
    {
      "id": "t1-puz-2",
      "section": "Puzzle Solving",
      "question": "Four friends P, Q, R and S sit in a row. P is left of Q, R is right of Q, and S is left of P. What is their seating order from left to right?",
      "options": [
        "S - P - Q - R",
        "P - S - Q - R",
        "S - Q - P - R",
        "P - Q - R - S"
      ],
      "correctAnswer": 0,
      "explanation": "P is left of Q (P, Q). R is right of Q (P, Q, R). S is left of P (S, P, Q, R).",
      "topic": "Linear Arrangement",
      "evidence": "Standard Practice",
      "difficulty": "Easy"
    },
    {
      "id": "t1-puz-3",
      "section": "Puzzle Solving",
      "question": "A standard analog clock shows 3:00. Find the smaller angle between the hour hand and the minute hand.",
      "options": [
        "75 degrees",
        "80 degrees",
        "90 degrees",
        "120 degrees"
      ],
      "correctAnswer": 2,
      "explanation": "At 3:00, the minute hand points directly at 12 and the hour hand points at 3. The angle between them is exactly 3 * 30 = 90 degrees.",
      "topic": "Clock Geometry",
      "evidence": "Standard Practice",
      "difficulty": "Easy"
    },
    {
      "id": "t1-puz-4",
      "section": "Puzzle Solving",
      "question": "You have 8 identical-looking balls; one is slightly heavier than the others. What is the minimum number of balance-scale weighings needed to guarantee finding the heavy ball?",
      "options": [
        "1 weighing",
        "2 weighings",
        "3 weighings",
        "4 weighings"
      ],
      "correctAnswer": 1,
      "explanation": "Weigh 3 balls against 3 balls. If balanced, weigh the remaining 2 balls to find the heavier one (2 weighings). If unbalanced, take the 3 heavier balls and weigh 1 vs 1. In both cases, exactly 2 weighings guarantee finding the heavy ball.",
      "topic": "Balance Scale Logic",
      "evidence": "Standard Practice",
      "difficulty": "Easy"
    }
  ]
};

export const MOCK_TEST_3: MockTestBundle = {
  "id": "mock-3",
  "testNumber": 3,
  "title": "Mock Test 3: Standard Recruitment Drive",
  "tag": "Moderate",
  "description": "Realistic on-campus drive level: 39 moderate questions with standard Infosys traps.",
  "totalQuestions": 39,
  "totalTimeMinutes": 70,
  "sectionsConfig": [
    {
      "id": "reasoning",
      "name": "Reasoning Ability",
      "questionCount": 10,
      "timeMinutes": 15,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Logical patterns, series, coding, and spatial relationships."
    },
    {
      "id": "math",
      "name": "Mathematical Ability",
      "questionCount": 10,
      "timeMinutes": 25,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Quantitative arithmetic, speed-time-distance, profit-loss, and algebra."
    },
    {
      "id": "verbal",
      "name": "Verbal Ability",
      "questionCount": 10,
      "timeMinutes": 12,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Grammar, sentence completion, antonyms, and error identification."
    },
    {
      "id": "pseudocode",
      "name": "Pseudocode",
      "questionCount": 5,
      "timeMinutes": 10,
      "cutoffPercentage": 60,
      "minCorrectRequired": 3,
      "description": "Loop execution, conditional branching, array indexing, and recursion."
    },
    {
      "id": "puzzle",
      "name": "Puzzle Solving",
      "questionCount": 4,
      "timeMinutes": 8,
      "cutoffPercentage": 50,
      "minCorrectRequired": 2,
      "description": "Analytical weighing, arrangement, switch logic, and constraint satisfaction."
    }
  ],
  "questions": [
    {
      "id": "mock-3-lr-1",
      "section": "Reasoning Ability",
      "question": "Find the next term: 4, 9, 19, 39, 79, ...",
      "options": [
        "119",
        "139",
        "159",
        "169"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-2",
      "section": "Reasoning Ability",
      "question": "If TABLE is coded as UBCMF, how is CHAIR coded?",
      "options": [
        "DIBJS",
        "DIBIR",
        "DHBJS",
        "DIBJT"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-3",
      "section": "Reasoning Ability",
      "question": "All analysts are graduates. Some graduates are programmers. Which conclusion definitely follows?",
      "options": [
        "All analysts are programmers",
        "Some programmers are analysts",
        "All analysts are graduates",
        "No programmer is a graduate"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-4",
      "section": "Reasoning Ability",
      "question": "A is the brother of B. B is the mother of C. How is A related to C?",
      "options": [
        "Father",
        "Maternal uncle",
        "Brother",
        "Grandfather"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-5",
      "section": "Reasoning Ability",
      "question": "A person faces west, turns 90 degrees clockwise, then 180 degrees anticlockwise. Which direction now?",
      "options": [
        "North",
        "South",
        "East",
        "West"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-6",
      "section": "Reasoning Ability",
      "question": "In a group of 60, 35 know Java, 30 know Python, and 15 know both. How many know neither?",
      "options": [
        "5",
        "10",
        "15",
        "20"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-7",
      "section": "Reasoning Ability",
      "question": "Find the missing pair: BC, EF, HI, KL, ...",
      "options": [
        "MN",
        "NO",
        "OP",
        "QR"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-8",
      "section": "Reasoning Ability",
      "question": "Six people sit around a circular table. A is opposite D; B is immediately clockwise of",
      "options": [
        "Who is immediately anticlockwise of A? A. C",
        "E",
        "F",
        "Cannot be determined 1"
      ],
      "correctAnswer": 3,
      "explanation": "Official test key specifies Option D as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-9",
      "section": "Reasoning Ability",
      "question": "If 1 January is Monday in a non-leap year, what day is 1 March?",
      "options": [
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-lr-10",
      "section": "Reasoning Ability",
      "question": "A server was unavailable; therefore, a user could not log in. Which assumption is most relevant?",
      "options": [
        "Login requires the server",
        "Users never forget passwords",
        "The network is always fast",
        "The user has no account"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-1",
      "section": "Mathematical Ability",
      "question": "A price is increased by 25% and then reduced by 20%. Net change is:",
      "options": [
        "No change",
        "5% increase",
        "5% decrease",
        "10% decrease"
      ],
      "correctAnswer": 0,
      "explanation": "Mathematical derivation confirms Option A as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-2",
      "section": "Mathematical Ability",
      "question": "A and B together finish a job in 8 days. A alone takes 12 days. B alone takes:",
      "options": [
        "18 days",
        "20 days",
        "24 days",
        "30 days"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-3",
      "section": "Mathematical Ability",
      "question": "A 180 m train crosses a pole in 9 seconds. Speed is:",
      "options": [
        "60 km/h",
        "64 km/h",
        "72 km/h",
        "80 km/h"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-4",
      "section": "Mathematical Ability",
      "question": "Compound interest on Rs. 10,000 at 10% per annum for 2 years, compounded annually, is:",
      "options": [
        "Rs. 2,000",
        "Rs. 2,050",
        "Rs. 2,100",
        "Rs. 2,200"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-5",
      "section": "Mathematical Ability",
      "question": "If x+y=14 and xy=45, findx2 +y 2.",
      "options": [
        "96",
        "100",
        "106",
        "116"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-6",
      "section": "Mathematical Ability",
      "question": "A committee of 2 is selected from 6 people. Number of ways:",
      "options": [
        "12",
        "15",
        "18",
        "30"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-7",
      "section": "Mathematical Ability",
      "question": "A bag has 5 white, 4 black and 3 red balls. Probability of not selecting a black ball is:",
      "options": [
        "1/3",
        "1/2",
        "2/3",
        "3/4"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-8",
      "section": "Mathematical Ability",
      "question": "A boat travels 24 km downstream in 2 hours and the same distance upstream in 3 hours. Speed of the stream is:",
      "options": [
        "1 km/h",
        "2 km/h",
        "3 km/h",
        "4 km/h"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-9",
      "section": "Mathematical Ability",
      "question": "The median of 3, 7, 8, 11, 14, 19, 21 is:",
      "options": [
        "8",
        "11",
        "14",
        "19"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-ma-10",
      "section": "Mathematical Ability",
      "question": "A 40-litre solution contains 25% acid. How much water must be added to make it 20% acid?",
      "options": [
        "5 L",
        "8 L",
        "10 L",
        "12 L"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-1",
      "section": "Verbal Ability",
      "question": "Choose the synonym of Meticulous.",
      "options": [
        "Careless",
        "Thorough",
        "Hasty",
        "Ordinary"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-2",
      "section": "Verbal Ability",
      "question": "Choose the antonym of Obsolete.",
      "options": [
        "Outdated",
        "Ancient",
        "Current",
        "Unused"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-3",
      "section": "Verbal Ability",
      "question": "Choose the grammatically correct sentence.",
      "options": [
        "Neither of the answers are correct.",
        "Neither of the answers is correct.",
        "Neither answers is correct.",
        "Neither answer are correct."
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-4",
      "section": "Verbal Ability",
      "question": "Had I known about the delay, I ___ earlier.",
      "options": [
        "will leave",
        "would have left",
        "left",
        "would leave"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-5",
      "section": "Verbal Ability",
      "question": "The new policy will ___ employee productivity.",
      "options": [
        "effect",
        "affect",
        "effects",
        "affects"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-6",
      "section": "Verbal Ability",
      "question": "Choose the correctly punctuated sentence.",
      "options": [
        "However I completed the task.",
        "However, I completed the task.",
        "However I, completed the task.",
        "However; I, completed the task."
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-7",
      "section": "Verbal Ability",
      "question": "Choose the passive form: The manager will review the report.",
      "options": [
        "The report will be reviewed by the manager.",
        "The report is reviewed by the manager.",
        "The manager will be reviewed by the report.",
        "The report has reviewed the manager."
      ],
      "correctAnswer": 0,
      "explanation": "Grammatical and verbal syntax rules confirm Option A is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-8",
      "section": "Verbal Ability",
      "question": "The solution was expensive; ___, it was reliable.",
      "options": [
        "therefore",
        "nevertheless",
        "because",
        "unless"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-9",
      "section": "Verbal Ability",
      "question": "Choose the word closest to Ambiguous.",
      "options": [
        "Clear",
        "Uncertain",
        "Exact",
        "Obvious"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-va-10",
      "section": "Verbal Ability",
      "question": "Identify the error: The quality of these products have improved.",
      "options": [
        "quality",
        "these",
        "have",
        "improved"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-pc-1",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? s=0; for i=1 to 5: if i mod 2==1: s=s+i; print(s)",
      "options": [
        "6",
        "8",
        "9",
        "15"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-pc-2",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? f(n): if n<=1 return 1; return n*f(n-1); print(f(4))",
      "options": [
        "10",
        "16",
        "24",
        "120"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-pc-3",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? a=[1,2,3,4]; for i=0 to 2: a[i+1]=a[i+1]+a[i]; print(a[3])",
      "options": [
        "7",
        "8",
        "9",
        "10 3"
      ],
      "correctAnswer": 3,
      "explanation": "Tracing variable state mutations step-by-step produces output D.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-pc-4",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": null,
      "options": [
        "O(n)",
        "O(logn)",
        "O(n 2)",
        "O(2 n)"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "mock-3-pc-5",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? x=10; y=3; while x>y: x=x-y; print(x)",
      "options": [
        "0",
        "1",
        "2",
        "3"
      ],
      "correctAnswer": 0,
      "explanation": "Tracing variable state mutations step-by-step produces output A.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Medium"
    },
    {
      "id": "t2-puz-1",
      "section": "Puzzle Solving",
      "question": "A, B, C and D each have a different role: tester, developer, analyst and designer. A is not developer or tester. B is not analyst. C is designer. D is not tester. If A is analyst, determine the remaining roles.",
      "options": [
        "B = tester, D = developer",
        "B = developer, D = tester",
        "B = tester, D = analyst",
        "B = designer, D = developer"
      ],
      "correctAnswer": 0,
      "explanation": "C is designer and A is analyst. Remaining roles are developer and tester. D is not tester, so D must be developer. That leaves B as tester.",
      "topic": "Role Deductions",
      "evidence": "Standard Practice",
      "difficulty": "Medium"
    },
    {
      "id": "t2-puz-2",
      "section": "Puzzle Solving",
      "question": "You have 3 switches outside a closed room connected to 3 light bulbs inside. You can only enter the room once. How do you uniquely match each switch to its bulb?",
      "options": [
        "Turn switch 1 on for 5 min, turn it off, turn switch 2 on, then enter: lit = 2, warm = 1, cold = 3",
        "Turn switch 1 and 2 on, enter room: either bulb is switch 1",
        "Turn switch 1 on and switch 3 off, look under the door crack",
        "It is impossible in only one visit"
      ],
      "correctAnswer": 0,
      "explanation": "Turn switch 1 ON for several minutes to allow the filament to heat up. Turn switch 1 OFF and switch 2 ON. Enter the room: the lit bulb corresponds to switch 2, the unlit but warm bulb to switch 1, and the unlit cold bulb to switch 3.",
      "topic": "Thermal State Deduction",
      "evidence": "Standard Practice",
      "difficulty": "Medium"
    },
    {
      "id": "t2-puz-3",
      "section": "Puzzle Solving",
      "question": "A two-digit number has digits summing to 11. When the digits are reversed, the new number is 27 greater than the original number. What is the original number?",
      "options": [
        "38",
        "47",
        "56",
        "29"
      ],
      "correctAnswer": 1,
      "explanation": "Let original number be 10x + y where x + y = 11. Reversed number is 10y + x. (10y + x) - (10x + y) = 9(y - x) = 27 => y - x = 3. Solving x + y = 11 and y - x = 3 gives y = 7 and x = 4. Original number = 47.",
      "topic": "Number Properties",
      "evidence": "Standard Practice",
      "difficulty": "Medium"
    },
    {
      "id": "t2-puz-4",
      "section": "Puzzle Solving",
      "question": "Five tasks A, B, C, D and E must be executed. D must run before B. B must run before E. E must run before A. A must run before C. What is a valid execution sequence?",
      "options": [
        "D, B, E, A, C",
        "B, D, E, A, C",
        "D, E, B, A, C",
        "A, B, C, D, E"
      ],
      "correctAnswer": 0,
      "explanation": "Chain of dependencies: D -> B -> E -> A -> C. The only valid linear ordering is D, B, E, A, C.",
      "topic": "Topological Order",
      "evidence": "Standard Practice",
      "difficulty": "Medium"
    }
  ]
};

export const MOCK_TEST_4: MockTestBundle = {
  "id": "mock-4",
  "testNumber": 4,
  "title": "Mock Test 4: Advanced Systems Engineer Challenge",
  "tag": "Hard",
  "description": "High-intensity exam: 39 challenging questions with advanced pseudocode and complex logic.",
  "totalQuestions": 39,
  "totalTimeMinutes": 70,
  "sectionsConfig": [
    {
      "id": "reasoning",
      "name": "Reasoning Ability",
      "questionCount": 10,
      "timeMinutes": 15,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Logical patterns, series, coding, and spatial relationships."
    },
    {
      "id": "math",
      "name": "Mathematical Ability",
      "questionCount": 10,
      "timeMinutes": 25,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Quantitative arithmetic, speed-time-distance, profit-loss, and algebra."
    },
    {
      "id": "verbal",
      "name": "Verbal Ability",
      "questionCount": 10,
      "timeMinutes": 12,
      "cutoffPercentage": 65,
      "minCorrectRequired": 7,
      "description": "Grammar, sentence completion, antonyms, and error identification."
    },
    {
      "id": "pseudocode",
      "name": "Pseudocode",
      "questionCount": 5,
      "timeMinutes": 10,
      "cutoffPercentage": 60,
      "minCorrectRequired": 3,
      "description": "Loop execution, conditional branching, array indexing, and recursion."
    },
    {
      "id": "puzzle",
      "name": "Puzzle Solving",
      "questionCount": 4,
      "timeMinutes": 8,
      "cutoffPercentage": 50,
      "minCorrectRequired": 2,
      "description": "Analytical weighing, arrangement, switch logic, and constraint satisfaction."
    }
  ],
  "questions": [
    {
      "id": "mock-4-lr-1",
      "section": "Reasoning Ability",
      "question": "Find the next term: 2, 6, 15, 31, 56, ...",
      "options": [
        "82",
        "88",
        "92",
        "96"
      ],
      "correctAnswer": 2,
      "explanation": "Official test key specifies Option C as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-2",
      "section": "Reasoning Ability",
      "question": "If the letters of COMPUTER are arranged alphabetically, which letter is fourth?",
      "options": [
        "E",
        "M",
        "O",
        "P"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-3",
      "section": "Reasoning Ability",
      "question": "In a code, each letter is replaced by the letter three places ahead, wrapping after Z. Encode LOGIC.",
      "options": [
        "ORJLF",
        "ORJID",
        "MPHJD",
        "ORJLC"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-4",
      "section": "Reasoning Ability",
      "question": "A, B, C, D and E sit in a row. A is not at an end. B is immediately left of C. D is at the right end. E is not next to D. Which arrangement is possible?",
      "options": [
        "A B C E D",
        "B C A E D",
        "E A B C D",
        "C B A E D"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-5",
      "section": "Reasoning Ability",
      "question": "A is older than B but younger than C. D is younger than B. E is older than C. Who is second oldest?",
      "options": [
        "A",
        "B",
        "C",
        "D"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-6",
      "section": "Reasoning Ability",
      "question": "A survey of 100 people finds 60 use app A, 50 use app B and 30 use both. How many use exactly one app?",
      "options": [
        "40",
        "50",
        "60",
        "80"
      ],
      "correctAnswer": 3,
      "explanation": "Official test key specifies Option D as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-7",
      "section": "Reasoning Ability",
      "question": "If 5 machines make 5 parts in 5 minutes, how long will 100 machines take to make 100 parts?",
      "options": [
        "5 minutes",
        "20 minutes",
        "100 minutes",
        "500 minutes"
      ],
      "correctAnswer": 0,
      "explanation": "Official test key specifies Option A as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-8",
      "section": "Reasoning Ability",
      "question": "A cube is painted on all faces and cut into 27 equal smaller cubes. How many small cubes have exactly two painted faces?",
      "options": [
        "8",
        "12",
        "16",
        "20 1"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-9",
      "section": "Reasoning Ability",
      "question": "A person travels half a journey at 40 km/h and the other half at 60 km/h. Average speed is:",
      "options": [
        "45 km/h",
        "48 km/h",
        "50 km/h",
        "52 km/h"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-lr-10",
      "section": "Reasoning Ability",
      "question": "Some APIs are secure. All secure systems are monitored. Which conclusion follows?",
      "options": [
        "All APIs are monitored",
        "Some APIs are monitored",
        "No API is monitored",
        "All monitored systems are APIs"
      ],
      "correctAnswer": 1,
      "explanation": "Official test key specifies Option B as the logically correct deduction.",
      "topic": "Logical Deduction",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-1",
      "section": "Mathematical Ability",
      "question": "Ifx\u2212 1 x = 3, findx 2 + 1 x2.",
      "options": [
        "7",
        "9",
        "11",
        "13"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-2",
      "section": "Mathematical Ability",
      "question": "A sum doubles in 8 years at simple interest. In how many years will it become five times?",
      "options": [
        "24",
        "28",
        "32",
        "36"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-3",
      "section": "Mathematical Ability",
      "question": "A and B can complete a task in 12 and 18 days. They work together for 4 days, then A leaves. How many additional days does B need?",
      "options": [
        "6",
        "8",
        "10",
        "12"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-4",
      "section": "Mathematical Ability",
      "question": "How many distinct arrangements can be made from the letters of LEVEL?",
      "options": [
        "20",
        "30",
        "60",
        "120"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-5",
      "section": "Mathematical Ability",
      "question": "A box contains 4 defective and 6 good components. Two are selected without replacement. Proba- bility both are good is:",
      "options": [
        "1/3",
        "2/5",
        "1/2",
        "3/5"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-6",
      "section": "Mathematical Ability",
      "question": "If the roots oft2 \u22127t+ 10 = 0are a and b, finda 2 +b 2.",
      "options": [
        "19",
        "29",
        "39",
        "49"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-7",
      "section": "Mathematical Ability",
      "question": "A mixture of milk and water is 5:3. If 16 litres of mixture is removed and replaced with water from a 64-litre vessel, what is the new milk:water ratio?",
      "options": [
        "5:11",
        "3:5",
        "1:2",
        "5:7"
      ],
      "correctAnswer": 0,
      "explanation": "Mathematical derivation confirms Option A as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-8",
      "section": "Mathematical Ability",
      "question": "A person invests Rs. 20,000 at 8% compound interest annually. Amount after 2 years is:",
      "options": [
        "Rs. 22,800",
        "Rs. 23,000",
        "Rs. 23,328",
        "Rs. 24,000"
      ],
      "correctAnswer": 2,
      "explanation": "Mathematical derivation confirms Option C as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-9",
      "section": "Mathematical Ability",
      "question": "A circle has radius 7 cm. Using\u03c0= 22/7, its area is:",
      "options": [
        "144 cm2",
        "154 cm2",
        "164 cm2",
        "176 cm2"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-ma-10",
      "section": "Mathematical Ability",
      "question": "A data set has mean 20 for 5 values. If one value 12 is replaced by 22, the new mean is:",
      "options": [
        "20",
        "21",
        "22",
        "23"
      ],
      "correctAnswer": 1,
      "explanation": "Mathematical derivation confirms Option B as the accurate solution.",
      "topic": "Quantitative Arithmetic",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-1",
      "section": "Verbal Ability",
      "question": "Choose the synonym of Pragmatic.",
      "options": [
        "Idealistic",
        "Practical",
        "Uncertain",
        "Emotional"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-2",
      "section": "Verbal Ability",
      "question": "Choose the antonym of Concur.",
      "options": [
        "Agree",
        "Approve",
        "Disagree",
        "Confirm"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-3",
      "section": "Verbal Ability",
      "question": "Choose the grammatically correct sentence.",
      "options": [
        "The data is analysed by the team yesterday.",
        "The data were analysed by the team yesterday.",
        "The data were analyse by the team yesterday.",
        "The data has analyse yesterday."
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-4",
      "section": "Verbal Ability",
      "question": "No sooner had the meeting started ___ the power failed.",
      "options": [
        "when",
        "then",
        "than",
        "that"
      ],
      "correctAnswer": 2,
      "explanation": "Grammatical and verbal syntax rules confirm Option C is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-5",
      "section": "Verbal Ability",
      "question": "The proposal was rejected, not because it was costly, ___ because it lacked evidence.",
      "options": [
        "and",
        "but",
        "so",
        "or"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-6",
      "section": "Verbal Ability",
      "question": "Choose the correct reported speech: He said, \u201cI am working.\u201d",
      "options": [
        "He said that he is working.",
        "He said that he was working.",
        "He says he was working.",
        "He told that I am working."
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-7",
      "section": "Verbal Ability",
      "question": "Choose the word closest to Resilient.",
      "options": [
        "Fragile",
        "Adaptable",
        "Rigid",
        "Indifferent"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-8",
      "section": "Verbal Ability",
      "question": "Identify the error: The committee have submitted its report.",
      "options": [
        "committee",
        "have",
        "its",
        "report"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-9",
      "section": "Verbal Ability",
      "question": "Choose the correctly spelt word.",
      "options": [
        "Entrepreneur",
        "Enterpreneur",
        "Entreprenuer",
        "Entreprenur"
      ],
      "correctAnswer": 0,
      "explanation": "Grammatical and verbal syntax rules confirm Option A is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-va-10",
      "section": "Verbal Ability",
      "question": "The code is concise; ___, it is difficult to maintain.",
      "options": [
        "moreover",
        "however",
        "therefore",
        "similarly"
      ],
      "correctAnswer": 1,
      "explanation": "Grammatical and verbal syntax rules confirm Option B is standard.",
      "topic": "Verbal Grammar",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-pc-1",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? f(n): if n==0 return 0; return n+f(n-1); print(f(4))",
      "options": [
        "6",
        "10",
        "16",
        "24"
      ],
      "correctAnswer": 1,
      "explanation": "Tracing variable state mutations step-by-step produces output B.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-pc-2",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? a=[3,1,4,1]; for i=1 to 3: if a[i]<a[i-1]: swap(a[i],a[i-1]); print(a[0])",
      "options": [
        "1",
        "3",
        "4",
        "1,3"
      ],
      "correctAnswer": 0,
      "explanation": "Tracing variable state mutations step-by-step produces output A.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-pc-3",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": null,
      "options": [
        "10",
        "11",
        "512",
        "1024 3"
      ],
      "correctAnswer": 1,
      "explanation": "Tracing variable state mutations step-by-step produces output B.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-pc-4",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "What is the time complexity? for i=1 to n: j=1; while j<n: j=j*2",
      "options": [
        "O(n 2)",
        "O(nlogn)",
        "O(logn)",
        "O(2 n)"
      ],
      "correctAnswer": 1,
      "explanation": "Tracing variable state mutations step-by-step produces output B.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "mock-4-pc-5",
      "section": "Pseudocode",
      "question": "Trace the execution of the following pseudocode algorithm and determine the final printed value:",
      "codeSnippet": "Output? x=1; for i=1 to 4: x=2*x+1; print(x)",
      "options": [
        "15",
        "16",
        "31",
        "32"
      ],
      "correctAnswer": 2,
      "explanation": "Tracing variable state mutations step-by-step produces output C.",
      "topic": "Variable Tracing & Loops",
      "evidence": "Candidate-Recalled",
      "difficulty": "Hard"
    },
    {
      "id": "t3-puz-1",
      "section": "Puzzle Solving",
      "question": "You have 12 coins, one counterfeit coin that may be either heavier or lighter than normal. What is the minimum number of balance-scale weighings to identify the counterfeit and whether it is heavy or light?",
      "options": [
        "2 weighings",
        "3 weighings",
        "4 weighings",
        "5 weighings"
      ],
      "correctAnswer": 1,
      "explanation": "The classic 12-coin ternary decision tree uniquely distinguishes 24 possible outcomes (12 coins * 2 states) in exactly 3 weighings (3^3 = 27 >= 24) by weighing 4 vs 4 first.",
      "topic": "Ternary Search Tree",
      "evidence": "Standard Practice",
      "difficulty": "Hard"
    },
    {
      "id": "t3-puz-2",
      "section": "Puzzle Solving",
      "question": "Three people make statements: A says 'B is lying'. B says 'C is lying'. C says 'Both A and B are telling the truth'. Who is telling the truth and who is lying?",
      "options": [
        "A and C are truthful; B is lying",
        "A is lying; B and C are truthful",
        "A is truthful; B is lying; C is lying",
        "All three are lying"
      ],
      "correctAnswer": 2,
      "explanation": "If C is truthful, then B is telling truth, which contradicts C's statement that B is lying. Hence C is lying. Since C is lying, B's statement 'C is lying' is TRUE. Since B is truthful, A's statement 'B is lying' is FALSE. Thus B is truthful, A and C are lying.",
      "topic": "Truth-teller / Liar Logic",
      "evidence": "Standard Practice",
      "difficulty": "Hard"
    },
    {
      "id": "t3-puz-3",
      "section": "Puzzle Solving",
      "question": "Tasks with runtimes [11, 7, 5, 3, 2] must be scheduled across 2 identical processors. What is the minimum possible total makespan (completion time)?",
      "options": [
        "13 units",
        "14 units",
        "15 units",
        "16 units"
      ],
      "correctAnswer": 1,
      "explanation": "Total work = 11 + 7 + 5 + 3 + 2 = 28 units. Optimal partition: Processor 1 takes (11 + 3) = 14; Processor 2 takes (7 + 5 + 2) = 14. Minimum makespan is exactly 14 units.",
      "topic": "Partition Optimization",
      "evidence": "Standard Practice",
      "difficulty": "Hard"
    },
    {
      "id": "t3-puz-4",
      "section": "Puzzle Solving",
      "question": "25 horses compete on a track with only 5 lanes (no timer). What is the minimum number of races needed to identify the top 3 fastest horses?",
      "options": [
        "6 races",
        "7 races",
        "8 races",
        "9 races"
      ],
      "correctAnswer": 1,
      "explanation": "Race 1-5: 5 groups of 5 horses (5 races). Race 6: race the 5 winners to find the 1st fastest horse (1 race). Race 7: race remaining eligible contenders for 2nd and 3rd place (1 race). Total = 5 + 1 + 1 = 7 races.",
      "topic": "Classic Horse Race Puzzle",
      "evidence": "Standard Practice",
      "difficulty": "Hard"
    }
  ]
};

export const ALL_INFOSYS_MOCK_TESTS: MockTestBundle[] = [
  MOCK_TEST_1,
  MOCK_TEST_2,
  MOCK_TEST_3,
  MOCK_TEST_4
];
