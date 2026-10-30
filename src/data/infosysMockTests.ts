import type { InfosysQuestion, SectionConfig, InterviewPrompt } from './infosysPrepData';
import { OFFICIAL_54_QUESTIONS, INFOSYS_SECTIONS_CONFIG } from './infosysPrepData';

export interface MockTestBundle {
  id: string;
  testNumber: number;
  title: string;
  subtitle: string;
  tag: 'Official Sample' | 'Easy' | 'Moderate' | 'Hard';
  accentColor: string;
  gradient: string;
  cardBannerColor: string;
  accentBorder: string;
  description: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  sectionsConfig: SectionConfig[];
  questions: InfosysQuestion[];
  technicalPrompts: InterviewPrompt[];
  hrPrompts: InterviewPrompt[];
}

export const MOCK_TEST_1: MockTestBundle = {
  id: 'mock-1',
  testNumber: 1,
  title: 'Mock Test 1: Official Placement Blueprint',
  subtitle: 'Format A Hiring Blueprint',
  tag: 'Official Sample',
  accentColor: '#2563eb',
  gradient: 'from-blue-600 via-indigo-600 to-blue-700',
  cardBannerColor: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700',
  accentBorder: 'hover:border-blue-500',
  description: 'Authentic 54-question screening blueprint with 5 timed sections, 7 technical interview prompts, and 4 HR behavioral scenarios.',
  totalQuestions: 54,
  totalTimeMinutes: 100,
  sectionsConfig: INFOSYS_SECTIONS_CONFIG,
  questions: OFFICIAL_54_QUESTIONS,
  technicalPrompts: [
  {
    "id": "t1-tech-1",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "Explain the four fundamental pillars of Object-Oriented Programming (OOP) with a concise real-world software example.",
    "expectedPoints": [
      "Encapsulation: Bundling state and behavior with private fields and public getters/setters.",
      "Abstraction: Hiding complex implementation and exposing clear interfaces.",
      "Inheritance: Code reusability via superclass-subclass relationship.",
      "Polymorphism: Overloading (compile-time) and Overriding (runtime)."
    ],
    "sampleAnswerGuide": "Use a Banking or E-Commerce domain model to ground all four concepts."
  },
  {
    "id": "t1-tech-2",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "What is the distinction between Method Overloading and Method Overriding in Java?",
    "expectedPoints": [
      "Overloading: Same method name with different parameter signatures in the same class (compile-time).",
      "Overriding: Subclass providing specific implementation for a superclass method (runtime)."
    ],
    "sampleAnswerGuide": "Show syntax comparison with dynamic dispatch."
  },
  {
    "id": "t1-tech-3",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "How do you find the second-highest salary from an Employee table in SQL?",
    "expectedPoints": [
      "Approach 1: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
      "Approach 2: SELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;"
    ],
    "sampleAnswerGuide": "Mention NULL handling if there is only 1 employee in table."
  },
  {
    "id": "t1-tech-4",
    "category": "Operating Systems & Networks",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "Explain the ACID properties of a database transaction and why they matter in banking software.",
    "expectedPoints": [
      "Atomicity: All-or-nothing execution.",
      "Consistency: State transitions preserve integrity constraints.",
      "Isolation: Concurrent transactions execute without interference.",
      "Durability: Committed writes persist across power failures."
    ],
    "sampleAnswerGuide": "Walk through a fund transfer between account A and account B."
  },
  {
    "id": "t1-tech-5",
    "category": "DSA & Problem Solving",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "What is the difference between an Array and a Linked List regarding time complexity of insertions?",
    "expectedPoints": [
      "Array insertion at beginning or middle requires O(n) element shifts.",
      "Linked List insertion at head is O(1) with pointer updates.",
      "Array offers O(1) random access; Linked list requires O(n) traversal."
    ],
    "sampleAnswerGuide": "Contrast contiguous vs non-contiguous heap memory allocation."
  },
  {
    "id": "t1-tech-6",
    "category": "Operating Systems & Networks",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "What is the difference between a Process and a Thread in operating systems?",
    "expectedPoints": [
      "Process has its own independent address space, PCB, and file descriptors.",
      "Threads within a process share code, data, and heap segments but have private stacks.",
      "Thread context switching is much faster with lower overhead."
    ],
    "sampleAnswerGuide": "Relate to browser tabs versus background worker threads."
  },
  {
    "id": "t1-tech-7",
    "category": "Projects & Resume",
    "round": "Technical Interview",
    "tag": "Mock 1 Blueprint",
    "question": "Walk me through one major technical bug or architecture roadblock you encountered in your academic project and how you resolved it.",
    "expectedPoints": [
      "Precise definition of problem symptom and root cause.",
      "Debugging methodology (logs, unit testing, profiler).",
      "Corrective architecture fix and outcome."
    ],
    "sampleAnswerGuide": "Use STAR framework with emphasis on your personal technical contribution."
  }
],
  hrPrompts: [
  {
    "id": "t1-hr-1",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 1 HR",
    "question": "Tell me about yourself, your academic journey, and what made you choose software engineering.",
    "expectedPoints": [
      "Concise 60-90 second introduction.",
      "Degree, engineering discipline, and key technical stack.",
      "Passion for building reliable systems and willingness to learn."
    ],
    "sampleAnswerGuide": "Maintain steady executive composure and direct eye contact."
  },
  {
    "id": "t1-hr-2",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 1 HR",
    "question": "Why do you specifically want to start your professional engineering career at Infosys?",
    "expectedPoints": [
      "Global reputation and high-impact enterprise digital transformations.",
      "World-class foundational training program at GEC Mysuru.",
      "Commitment to ethical culture, innovation, and long-term career growth."
    ],
    "sampleAnswerGuide": "Show specific knowledge of Infosys culture and Mysuru campus."
  },
  {
    "id": "t1-hr-3",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 1 HR",
    "question": "Are you comfortable with unconditional relocation to any of Infosys development centres across India and working in rotational shifts?",
    "expectedPoints": [
      "Clear, unequivocal confirmation of relocation willingness.",
      "Adaptability to multi-cultural team environments.",
      "Openness to business requirements and rotational project rosters."
    ],
    "sampleAnswerGuide": "State clear affirmation without hesitation."
  },
  {
    "id": "t1-hr-4",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 1 HR",
    "question": "Describe a situation where a teammate was not delivering their part of a project. How did you handle the situation?",
    "expectedPoints": [
      "Avoided blame or hostility; arranged a 1-on-1 discussion.",
      "Understood their root bottleneck (skill gap or personal issue).",
      "Re-allocated tasks collaboratively to ensure milestone completion on time."
    ],
    "sampleAnswerGuide": "Highlight emotional intelligence and team-first orientation."
  }
]
};

export const MOCK_TEST_2: MockTestBundle = {
  id: 'mock-2',
  testNumber: 2,
  title: 'Mock Test 2: Core Aptitude & Speed Fundamentals',
  subtitle: 'Foundation Practice Track',
  tag: 'Easy',
  accentColor: '#059669',
  gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
  cardBannerColor: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700',
  accentBorder: 'hover:border-emerald-500',
  description: 'Essential foundation test: 39 questions across 5 sections, followed by 8 foundational technical prompts and 5 HR discussions.',
  totalQuestions: 39,
  totalTimeMinutes: 70,
  sectionsConfig: [
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
  questions: [
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
],
  technicalPrompts: [
  {
    "id": "t2-tech-1",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "Introduce yourself and summarize your primary programming languages and technical interests.",
    "expectedPoints": [
      "Concise academic background and core language proficiency (Java, Python, C++).",
      "Areas of interest: backend systems, web development, cloud computing.",
      "Key frameworks and database technologies used in college projects."
    ],
    "sampleAnswerGuide": "Keep summary under 90 seconds highlighting core technical strengths."
  },
  {
    "id": "t2-tech-2",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "What is the difference between an Interface and an Abstract Class in Java?",
    "expectedPoints": [
      "Interface supports multiple inheritance; abstract class supports single inheritance.",
      "Abstract classes can hold state (instance fields); interfaces only contain public static final constants.",
      "Interfaces define contracts; abstract classes provide partial common implementation."
    ],
    "sampleAnswerGuide": "Mention default and static methods introduced in Java 8."
  },
  {
    "id": "t2-tech-3",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "What is the difference between == and equals() in Java?",
    "expectedPoints": [
      "== compares memory addresses (reference equality for objects, value equality for primitives).",
      "equals() compares logical content and internal state of objects.",
      "Classes like String and Integer override equals() for deep equality."
    ],
    "sampleAnswerGuide": "Provide String s1 = new String('abc'); String s2 = new String('abc'); as example."
  },
  {
    "id": "t2-tech-4",
    "category": "DSA & Problem Solving",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "What is a Stack data structure and what are two real-world software applications of it?",
    "expectedPoints": [
      "LIFO (Last-In, First-Out) linear structure with push and pop in O(1).",
      "Application 1: Call stack for recursion and function calls in runtime environments.",
      "Application 2: Undo/Redo operations in text editors and browser back-forward history."
    ],
    "sampleAnswerGuide": "Mention parentheses matching or expression parsing as third application."
  },
  {
    "id": "t2-tech-5",
    "category": "DSA & Problem Solving",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "Explain Binary Search and state its best, average, and worst-case time complexities.",
    "expectedPoints": [
      "Requires sorted collection; repeatedly halves search interval.",
      "Compares target with middle element: left if smaller, right if larger.",
      "Time complexity: O(1) best case, O(log n) average and worst case; Space O(1)."
    ],
    "sampleAnswerGuide": "Explain why array must be strictly sorted beforehand."
  },
  {
    "id": "t2-tech-6",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "What is the difference between a Primary Key and a Foreign Key in relational databases?",
    "expectedPoints": [
      "Primary Key uniquely identifies each record in its table; cannot be NULL.",
      "Foreign Key references the primary key in another table; enforces referential integrity.",
      "A table can have only one Primary Key, but multiple Foreign Keys."
    ],
    "sampleAnswerGuide": "Give Department and Employee table relationship example."
  },
  {
    "id": "t2-tech-7",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "Write an SQL query to display the number of employees in each department.",
    "expectedPoints": [
      "SELECT department_id, COUNT(*) AS employee_count FROM Employee GROUP BY department_id;",
      "Use of GROUP BY clause with COUNT aggregate function.",
      "Can add HAVING COUNT(*) > 5 for filtered departments."
    ],
    "sampleAnswerGuide": "Explain why GROUP BY is essential when using aggregate functions."
  },
  {
    "id": "t2-tech-8",
    "category": "Operating Systems & Networks",
    "round": "Technical Interview",
    "tag": "Mock 2 Tech",
    "question": "What is the difference between HTTP and HTTPS, and how does the SSL/TLS handshake protect data?",
    "expectedPoints": [
      "HTTP transmits data in plaintext over port 80; susceptible to eavesdropping.",
      "HTTPS encrypts payload using SSL/TLS over port 443.",
      "Ensures confidentiality, integrity, and server authentication via digital certificates."
    ],
    "sampleAnswerGuide": "Mention asymmetric encryption for key exchange followed by symmetric session keys."
  }
],
  hrPrompts: [
  {
    "id": "t2-hr-1",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 2 HR",
    "question": "Tell me about yourself in 60 to 90 seconds, emphasizing your career objectives.",
    "expectedPoints": [
      "Academic background, college, and branch.",
      "Key technical strengths and practical projects built.",
      "Objective to join a progressive IT leader like Infosys."
    ],
    "sampleAnswerGuide": "Be structured: Past education -> Present skills -> Future aspiration."
  },
  {
    "id": "t2-hr-2",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 2 HR",
    "question": "What do you know about Infosys and the major digital business services it provides?",
    "expectedPoints": [
      "Founded in 1981 in Pune, headquartered in Bengaluru.",
      "Pioneer of Global Delivery Model; serves Fortune 500 across 50+ countries.",
      "Key platforms: Infosys Cobalt (cloud), Topaz (generative AI), Finacle (core banking)."
    ],
    "sampleAnswerGuide": "Mentioning Topaz and Cobalt demonstrates genuine drive research."
  },
  {
    "id": "t2-hr-3",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 2 HR",
    "question": "What are your two greatest strengths, and what is one area you are actively improving?",
    "expectedPoints": [
      "Strengths backed by college project examples (e.g. quick learner, disciplined debugger).",
      "Genuine development area (e.g. public speaking or delegating tasks early).",
      "Concrete action taken to improve (e.g. joining technical toastmasters)."
    ],
    "sampleAnswerGuide": "Always turn weakness into a proactive self-improvement story."
  },
  {
    "id": "t2-hr-4",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 2 HR",
    "question": "Tell me about a time you experienced a setback or failure in college. What did you learn?",
    "expectedPoints": [
      "Honest description of context without blaming others.",
      "Accountability taken for the outcome.",
      "Concrete takeaway that made you a more resilient engineer."
    ],
    "sampleAnswerGuide": "Focus on the learning outcome and corrective behavior."
  },
  {
    "id": "t2-hr-5",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 2 HR",
    "question": "How do you manage tight deadlines when multiple assignments or projects are pending simultaneously?",
    "expectedPoints": [
      "Prioritization framework (Eisenhower matrix or urgency-impact ranking).",
      "Breaking large tasks into smaller daily deliverables.",
      "Proactive communication with mentors before deadline breaches."
    ],
    "sampleAnswerGuide": "Highlight systematic planning over panic."
  }
]
};

export const MOCK_TEST_3: MockTestBundle = {
  id: 'mock-3',
  testNumber: 3,
  title: 'Mock Test 3: Standard Recruitment Drive',
  subtitle: 'Campus Placement Track',
  tag: 'Moderate',
  accentColor: '#7c3aed',
  gradient: 'from-purple-600 via-violet-600 to-indigo-700',
  cardBannerColor: 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700',
  accentBorder: 'hover:border-purple-500',
  description: 'Realistic on-campus drive level: 39 moderate questions with 8 core technical interview prompts and 5 managerial HR questions.',
  totalQuestions: 39,
  totalTimeMinutes: 70,
  sectionsConfig: [
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
  questions: [
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
],
  technicalPrompts: [
  {
    "id": "t3-tech-1",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "Explain the architectural difference between JDK, JRE, and JVM.",
    "expectedPoints": [
      "JVM (Java Virtual Machine): Executes bytecode, handles JIT compilation and garbage collection.",
      "JRE (Java Runtime Environment): JVM + core standard libraries (rt.jar); runs Java apps.",
      "JDK (Java Development Kit): JRE + developer tools (javac compiler, debugger, javadoc)."
    ],
    "sampleAnswerGuide": "Use nested concentric diagram analogy: JDK contains JRE, which contains JVM."
  },
  {
    "id": "t3-tech-2",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "What is the difference between ArrayList and LinkedList in Java, and when should you choose each?",
    "expectedPoints": [
      "ArrayList uses dynamic resizable array; O(1) random get(index); O(n) worst-case add with resize.",
      "LinkedList uses doubly linked nodes; O(1) insert/remove at ends; O(n) get(index).",
      "ArrayList is preferred for read-heavy workloads; LinkedList for frequent head/tail modifications."
    ],
    "sampleAnswerGuide": "Mention memory overhead of next/prev pointers in LinkedList."
  },
  {
    "id": "t3-tech-3",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "Explain the internal working of a HashMap in Java. What happens when two keys produce a collision?",
    "expectedPoints": [
      "Array of Node buckets; index = hash(key) & (n - 1).",
      "Collision handled via separate chaining (linked list).",
      "Java 8 converts linked list to Balanced Red-Black Tree when bucket exceeds 8 entries (TREEIFY_THRESHOLD)."
    ],
    "sampleAnswerGuide": "Emphasize equals() and hashCode() contract importance."
  },
  {
    "id": "t3-tech-4",
    "category": "DSA & Problem Solving",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "Compare Breadth-First Search (BFS) and Depth-First Search (DFS). Give one software use case for each.",
    "expectedPoints": [
      "BFS uses Queue, explores level-by-level; finds shortest path in unweighted graphs.",
      "DFS uses Stack or recursion, explores branch deep first; used in topological sort and cycle detection.",
      "BFS Space: O(W) where W is tree width; DFS Space: O(H) where H is tree height."
    ],
    "sampleAnswerGuide": "Use social network degrees of connection for BFS and maze solving for DFS."
  },
  {
    "id": "t3-tech-5",
    "category": "DSA & Problem Solving",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "Compare Merge Sort and Quick Sort regarding average and worst-case time and space complexities.",
    "expectedPoints": [
      "Merge Sort: O(n log n) best, average, and worst-case; O(n) auxiliary memory; stable sort.",
      "Quick Sort: O(n log n) average, O(n^2) worst-case with poor pivot; O(log n) stack space; in-place.",
      "Quick Sort preferred in internal memory due to low constant factors and cache locality."
    ],
    "sampleAnswerGuide": "Explain why quicksort degrades to O(n^2) on already sorted arrays without randomized pivot."
  },
  {
    "id": "t3-tech-6",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "What is a database Index, and what performance trade-off does it introduce on write operations?",
    "expectedPoints": [
      "Data structure (typically B-Tree or B+ Tree) that speeds up SELECT queries from O(n) to O(log n).",
      "Trade-off: Slows down INSERT, UPDATE, and DELETE because index trees must be rebalanced.",
      "Consumes additional disk storage space."
    ],
    "sampleAnswerGuide": "Mention when NOT to create an index (small tables or columns with low cardinality)."
  },
  {
    "id": "t3-tech-7",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "Explain the difference between INNER JOIN and LEFT OUTER JOIN with a small table example.",
    "expectedPoints": [
      "INNER JOIN returns only matching rows present in both tables.",
      "LEFT JOIN returns all rows from left table plus matching rows from right table (or NULLs).",
      "Useful when fetching all customers even if they have placed zero orders."
    ],
    "sampleAnswerGuide": "Show Customers and Orders table join scenario."
  },
  {
    "id": "t3-tech-8",
    "category": "Operating Systems & Networks",
    "round": "Technical Interview",
    "tag": "Mock 3 Tech",
    "question": "What is REST architecture, and what are the standard HTTP methods GET, POST, PUT, and DELETE used for?",
    "expectedPoints": [
      "Representational State Transfer: stateless, resource-oriented HTTP communication.",
      "GET: Retrieve resource representation (idempotent & safe).",
      "POST: Create a new resource.",
      "PUT: Replace/update an entire resource (idempotent); PATCH for partial updates.",
      "DELETE: Remove a resource (idempotent)."
    ],
    "sampleAnswerGuide": "Highlight idempotency concept clearly."
  }
],
  hrPrompts: [
  {
    "id": "t3-hr-1",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 3 HR",
    "question": "Why do you prefer joining Infosys over other prominent IT services firms?",
    "expectedPoints": [
      "Admired brand heritage and corporate governance standards.",
      "Global delivery scale and cross-technology training at Mysuru.",
      "Opportunities across cloud, AI, and enterprise modernization."
    ],
    "sampleAnswerGuide": "Highlight company values and stability."
  },
  {
    "id": "t3-hr-2",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 3 HR",
    "question": "What do you understand by client-facing engineering work, and how would you prepare for it?",
    "expectedPoints": [
      "Direct communication with enterprise clients from diverse cultures and time zones.",
      "Active listening, accurate milestone commitments, and technical clarity.",
      "Professional email etiquette and conflict de-escalation."
    ],
    "sampleAnswerGuide": "Demonstrate understanding that technical code must serve business outcomes."
  },
  {
    "id": "t3-hr-3",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 3 HR",
    "question": "Tell me about a time you took ownership of a task or problem without being asked.",
    "expectedPoints": [
      "Identified an inefficiency or gap in college project or lab.",
      "Took initiative to research and implement an automated solution.",
      "Positive outcome achieved for the entire team."
    ],
    "sampleAnswerGuide": "Show proactive mindset rather than passive task-taker."
  },
  {
    "id": "t3-hr-4",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 3 HR",
    "question": "If assigned to a project using a tech stack you have never touched, how would you deliver on schedule?",
    "expectedPoints": [
      "Embrace steep learning curve with systematic self-study and official documentation.",
      "Build small proof-of-concept components to validate syntax and logic.",
      "Seek targeted guidance from senior developers after doing initial homework."
    ],
    "sampleAnswerGuide": "Show strong learning agility and resourcefulness."
  },
  {
    "id": "t3-hr-5",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 3 HR",
    "question": "Where do you envision yourself professionally three to five years after joining Infosys?",
    "expectedPoints": [
      "Years 1-2: Solidify full-stack engineering proficiency and earn cloud certifications.",
      "Years 3-5: Transition into Senior Systems Engineer / Module Lead role guiding freshers.",
      "Long-term goal: Solution architect or tech lead delivering high-value digital products."
    ],
    "sampleAnswerGuide": "Show ambitious yet grounded and loyal progression within Infosys."
  }
]
};

export const MOCK_TEST_4: MockTestBundle = {
  id: 'mock-4',
  testNumber: 4,
  title: 'Mock Test 4: Advanced Systems Engineer Challenge',
  subtitle: 'Elite Assessment Track',
  tag: 'Hard',
  accentColor: '#d97706',
  gradient: 'from-amber-600 via-orange-600 to-amber-700',
  cardBannerColor: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700',
  accentBorder: 'hover:border-amber-500',
  description: 'High-intensity assessment: 39 advanced questions with 8 senior technical architecture prompts and 5 leadership HR scenarios.',
  totalQuestions: 39,
  totalTimeMinutes: 70,
  sectionsConfig: [
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
  questions: [
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
],
  technicalPrompts: [
  {
    "id": "t4-tech-1",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "What are the SOLID design principles in software engineering? Explain any two with practical examples.",
    "expectedPoints": [
      "S: Single Responsibility Principle (class does only one job).",
      "O: Open/Closed Principle (open for extension, closed for modification).",
      "L: Liskov Substitution Principle (subclasses substitutable for base class).",
      "I: Interface Segregation Principle (small client-specific interfaces).",
      "D: Dependency Inversion Principle (depend upon abstractions, not concretions)."
    ],
    "sampleAnswerGuide": "Illustrate Single Responsibility (Invoice vs InvoicePrinter) clearly."
  },
  {
    "id": "t4-tech-2",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "Explain JVM Memory Areas: Stack, Heap, and Metaspace. How does Garbage Collection reclaim memory?",
    "expectedPoints": [
      "Stack: Thread-private; stores method call frames and local primitive variables.",
      "Heap: Shared memory; stores object instances (Young Gen: Eden, Survivor; Old Gen).",
      "Metaspace: Native memory holding class metadata, bytecode, and static variables.",
      "Garbage collection uses Mark-and-Sweep tracking live references from GC Roots."
    ],
    "sampleAnswerGuide": "Explain OutOfMemoryError vs StackOverflowError."
  },
  {
    "id": "t4-tech-3",
    "category": "Java & OOP",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "Explain the fundamental contract between equals() and hashCode() in Java. What happens if violated?",
    "expectedPoints": [
      "If a.equals(b) is true, then a.hashCode() MUST equal b.hashCode().",
      "If hashCodes match, objects may or may not be equal (collision).",
      "Violation causes hash-based collections (HashSet, HashMap) to lose entries or fail lookups."
    ],
    "sampleAnswerGuide": "Explain why mutable keys in HashMap can break lookup."
  },
  {
    "id": "t4-tech-4",
    "category": "Operating Systems & Networks",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "What is a Race Condition in concurrent programming? How can synchronized blocks or locks prevent it?",
    "expectedPoints": [
      "Occurs when multiple threads access and mutate shared state concurrently with non-deterministic output.",
      "Caused by non-atomic read-modify-write operations (e.g. count++).",
      "Prevented via synchronized methods, ReentrantLock, or Atomic variables (CAS)."
    ],
    "sampleAnswerGuide": "Use bank balance debit scenario with two simultaneous ATM withdrawals."
  },
  {
    "id": "t4-tech-5",
    "category": "DSA & Problem Solving",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "What is a Trie data structure? What problem does it solve more efficiently than a Hash Table?",
    "expectedPoints": [
      "Prefix tree where each node represents a character; edges form words.",
      "Provides O(L) search time where L is word length, independent of dictionary size N.",
      "Optimized for prefix search, autocomplete, and spell checking.",
      "Unlike Hash Table, supports lexicographical ordering and wildcard matches."
    ],
    "sampleAnswerGuide": "Explain search suggestions in search engines."
  },
  {
    "id": "t4-tech-6",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "Explain Database Normalization from 1NF through 3NF and why denormalization is sometimes practiced.",
    "expectedPoints": [
      "1NF: Atomic values; no repeating groups.",
      "2NF: 1NF + no partial dependency on composite primary key.",
      "3NF: 2NF + no transitive dependency (non-key attribute depending on another non-key).",
      "Denormalization intentionally introduces redundancy to reduce expensive multi-table JOINs in read-heavy OLAP."
    ],
    "sampleAnswerGuide": "Mention BCNF briefly as a stricter variant of 3NF."
  },
  {
    "id": "t4-tech-7",
    "category": "DBMS & SQL",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "Write an SQL query to find all duplicate email addresses from a Users table.",
    "expectedPoints": [
      "SELECT email, COUNT(*) FROM Users GROUP BY email HAVING COUNT(*) > 1;",
      "Use of HAVING clause with aggregate COUNT.",
      "Alternative using window function: WITH CTE AS (SELECT email, ROW_NUMBER() OVER(PARTITION BY email) as rn FROM Users) SELECT email FROM CTE WHERE rn > 1;"
    ],
    "sampleAnswerGuide": "Highlight why HAVING is used instead of WHERE for aggregate filters."
  },
  {
    "id": "t4-tech-8",
    "category": "Operating Systems & Networks",
    "round": "Technical Interview",
    "tag": "Mock 4 Tech",
    "question": "Explain Deadlock in operating systems and the four Coffman conditions necessary for deadlock to occur.",
    "expectedPoints": [
      "Mutual Exclusion: Resource held exclusively by one process.",
      "Hold and Wait: Process holding a resource is waiting for another.",
      "No Preemption: Resources cannot be forcibly seized.",
      "Circular Wait: Circular chain of processes each waiting for resource held by next."
    ],
    "sampleAnswerGuide": "Mention Banker's algorithm for avoidance and resource ordering for prevention."
  }
],
  hrPrompts: [
  {
    "id": "t4-hr-1",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 4 HR",
    "question": "Why should Infosys hire you over another engineering fresher with identical academic marks?",
    "expectedPoints": [
      "Hands-on execution beyond textbooks (live deployed apps, bug fixes, git workflow).",
      "Exceptional adaptability and continuous curiosity to master emerging tools.",
      "Strong collaborative temperament and accountability under high pressure."
    ],
    "sampleAnswerGuide": "Back claims with genuine project deliverables."
  },
  {
    "id": "t4-hr-2",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 4 HR",
    "question": "Describe a time you influenced team direction or resolved a technical dispute without having formal leadership authority.",
    "expectedPoints": [
      "Situation with conflicting technical proposals in a team.",
      "Used empirical data, benchmarks, or small prototypes rather than arguing.",
      "Guided team to unanimous consensus while maintaining positive relationships."
    ],
    "sampleAnswerGuide": "Demonstrate maturity and data-driven decision making."
  },
  {
    "id": "t4-hr-3",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 4 HR",
    "question": "Suppose you discover a teammate committed a critical defect into main branch right before a client release. What is your action plan?",
    "expectedPoints": [
      "Immediate mitigation: Alert team lead and revert or patch commit to protect pipeline.",
      "Work privately with teammate to diagnose defect without assigning public blame.",
      "Write automated regression test to ensure defect never recurs."
    ],
    "sampleAnswerGuide": "Show composure, empathy, and client-first responsibility."
  },
  {
    "id": "t4-hr-4",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 4 HR",
    "question": "How do you respond when a project manager or senior tech lead provides critical feedback on your code?",
    "expectedPoints": [
      "Listen actively without becoming defensive or taking it personally.",
      "Ask clarifying questions to understand architectural rationale.",
      "Implement recommendations promptly and thank reviewer for mentorship."
    ],
    "sampleAnswerGuide": "Demonstrate high coachability and growth mindset."
  },
  {
    "id": "t4-hr-5",
    "category": "HR & Behavioral",
    "round": "HR Interview",
    "tag": "Mock 4 HR",
    "question": "Do you have any questions for the Infosys interview panel regarding the role, training, or company culture?",
    "expectedPoints": [
      "Ask thoughtful questions showing genuine interest (e.g. Mysuru training tracks, Topaz AI integration, typical day for fresher).",
      "Avoid asking only about salary or leave policies."
    ],
    "sampleAnswerGuide": "Always prepare 2 thoughtful forward-looking questions."
  }
]
};

export const ALL_INFOSYS_MOCK_TESTS: MockTestBundle[] = [
  MOCK_TEST_1,
  MOCK_TEST_2,
  MOCK_TEST_3,
  MOCK_TEST_4
];
