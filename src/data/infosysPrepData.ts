export interface InfosysQuestion {
  id: string;
  section: 'Reasoning Ability' | 'Mathematical Ability' | 'Verbal Ability' | 'Pseudocode' | 'Puzzle Solving';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  topic: string;
  evidence: 'Official Sample' | 'Candidate-Recalled' | 'Standard Practice';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SectionConfig {
  id: string;
  name: 'Reasoning Ability' | 'Mathematical Ability' | 'Verbal Ability' | 'Pseudocode' | 'Puzzle Solving';
  questionCount: number;
  timeMinutes: number;
  cutoffPercentage: number;
  minCorrectRequired: number;
  description: string;
}

export interface InterviewPrompt {
  id: string;
  category: 'Java & OOP' | 'DBMS & SQL' | 'Operating Systems & Networks' | 'DSA & Problem Solving' | 'Projects & Resume' | 'HR & Behavioral';
  question: string;
  tag: string;
  round: 'Technical Interview' | 'HR Interview';
  expectedPoints: string[];
  sampleAnswerGuide: string;
}

export const INFOSYS_SECTIONS_CONFIG: SectionConfig[] = [
  {
    id: 'reasoning',
    name: 'Reasoning Ability',
    questionCount: 15,
    timeMinutes: 25,
    cutoffPercentage: 65,
    minCorrectRequired: 10,
    description: 'Deductive reasoning, analytical patterns, series, coding-decoding, and seating logic.'
  },
  {
    id: 'math',
    name: 'Mathematical Ability',
    questionCount: 10,
    timeMinutes: 35,
    cutoffPercentage: 65,
    minCorrectRequired: 7,
    description: 'Arithmetic, algebra, commercial mathematics, permutations, and probability.'
  },
  {
    id: 'verbal',
    name: 'Verbal Ability',
    questionCount: 20,
    timeMinutes: 20,
    cutoffPercentage: 65,
    minCorrectRequired: 13,
    description: 'Reading comprehension, grammar rules, vocabulary, error spotting, and sentence flow.'
  },
  {
    id: 'pseudocode',
    name: 'Pseudocode',
    questionCount: 5,
    timeMinutes: 10,
    cutoffPercentage: 60,
    minCorrectRequired: 3,
    description: 'Tracing logic, loops, conditional branches, operators precedence, and data structures.'
  },
  {
    id: 'puzzle',
    name: 'Puzzle Solving',
    questionCount: 4,
    timeMinutes: 10,
    cutoffPercentage: 50,
    minCorrectRequired: 2,
    description: 'Deductive constraint puzzles, number patterns, and lateral thinking riddles.'
  }
];

export const INFOSYS_COMPANY_OVERVIEW = {
  companyName: 'Infosys Limited',
  targetRole: 'Systems Engineer / Systems Engineer Trainee',
  referencePackage: 'INR 3.6 LPA',
  packageNote: 'Reported campus offer for recent drives (including 2026–2027 batch campus notices). Package is drive-specific and determined by the official offer letter.',
  totalQuestions: 54,
  totalTimeMinutes: 100,
  locations: [
    'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Bhubaneswar', 'Chandigarh', 
    'Coimbatore', 'Gurugram', 'Indore', 'Jaipur', 'Kolkata', 'Mangaluru', 'Mysuru', 'Mohali'
  ],
  trainingInfo: 'Campus hires undergo a 19 to 23-week world-class Foundation Program at the Global Education Center (GEC) in Mysuru.',
  disclaimer: 'This is an independent educational simulation created for AptiVerse users. It is not affiliated with, endorsed by, or operated by Infosys Limited.'
};

export interface SyllabusCategory {
  section: string;
  topics: string[];
}

export const INFOSYS_SYLLABUS: SyllabusCategory[] = [
  {
    section: 'Reasoning Ability',
    topics: [
      'Number and Alphabet Series',
      'Coding and Decoding (Letter Shifts & Matrices)',
      'Blood Relations & Family Tree Deductions',
      'Direction and Distance Sense Tests',
      'Linear and Circular Seating Arrangements',
      'Ordering, Ranking & Comparison Tests',
      'Syllogisms & Venn Diagram Validations',
      'Statement & Assumptions / Inferences',
      'Data Sufficiency Logic',
      'Pattern Completion and Analogy Deductions',
      'Scheduling & Calendar Logic'
    ]
  },
  {
    section: 'Mathematical Ability',
    topics: [
      'Number System, Divisibility & Remainder Theorems',
      'HCF and LCM Applications',
      'Percentages, Profit, Loss & Commercial Discounts',
      'Ratio & Proportion, Mixtures & Alligations',
      'Time and Work, Pipes & Cisterns',
      'Speed, Time and Distance (Trains, Relative Speeds, Boats)',
      'Simple and Compound Interest Calculations',
      'Permutations, Combinations & Probability Distributions',
      'Averages, Weighted Means & Age Problems',
      'Algebraic Equations, Geometry & Mensuration',
      'Data Interpretation (Tables, Bar Charts, Pie Charts)'
    ]
  },
  {
    section: 'Verbal Ability',
    topics: [
      'Reading Comprehension (Main idea, tone & inference)',
      'Error Spotting & Sentence Correction',
      'Subject-Verb Agreement Rules',
      'Tenses, Prepositions & Articles',
      'Contextual Synonyms and Antonyms',
      'Sentence Completion & Cohesive Fillers',
      'Para Jumbles (Sentence Ordering)',
      'Active and Passive Voice Transformations',
      'Direct and Indirect Reported Speech'
    ]
  },
  {
    section: 'Pseudocode',
    topics: [
      'Variable Scope, Primitive Types & Operator Precedence',
      'Pre-increment vs Post-increment Evaluation',
      'Conditional Branching (if-else, nested if, switch)',
      'Loops, Iteration Counters & Loop Terminations',
      'Array Traversal, Index Bounds & Matrix Logic',
      'Function Calls, Recursion Tracing & Call Stack',
      'Bitwise Operators (&, |, ^, <<, >>)',
      'Stack (LIFO) and Queue (FIFO) Operations'
    ]
  },
  {
    section: 'Puzzle Solving',
    topics: [
      '3x3 & 4x4 Number Grids with Doubling/Arithmetic Rules',
      'Mislabelled Boxes Elimination Deduction',
      'Two-Digit Number and Digit-Sum Cryptarithms',
      'Combinatorics Handshake & Group Pairing Puzzles',
      'Logical Sequence Constraint Arrangements'
    ]
  }
];

export const OFFICIAL_54_QUESTIONS: InfosysQuestion[] = [
  // ==========================================
  // SECTION 1: REASONING ABILITY (15 QUESTIONS)
  // ==========================================
  {
    id: 'log-1',
    section: 'Reasoning Ability',
    question: 'Find the next term in the series: 2, 6, 12, 20, 30, ___',
    options: ['36', '40', '42', '44'],
    correctAnswer: 2,
    explanation: 'Each term is given by n * (n + 1): 1*2 = 2, 2*3 = 6, 3*4 = 12, 4*5 = 20, 5*6 = 30. The next term is 6 * 7 = 42. (Or consecutive differences: +4, +6, +8, +10, +12 -> 30 + 12 = 42).',
    topic: 'Number Series',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-2',
    section: 'Reasoning Ability',
    question: 'If CAT is coded as DBU by shifting each letter one position forward (+1), how is DOG coded in the same pattern?',
    options: ['EPH', 'CNG', 'FQI', 'EOG'],
    correctAnswer: 0,
    explanation: 'Each character shifts +1 forward in the alphabet: D -> E, O -> P, G -> H. Result is EPH.',
    topic: 'Coding-Decoding',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-3',
    section: 'Reasoning Ability',
    question: 'A person walks 5 km North, turns right and walks 3 km East, and then turns right again and walks 5 km South. Where is the person located relative to the starting point?',
    options: ['3 km East', '3 km West', '5 km North', 'At the starting point'],
    correctAnswer: 0,
    explanation: 'North (5 km) and South (5 km) cancel each other out on the vertical axis. The net displacement remains 3 km East of the starting point.',
    topic: 'Direction Sense',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-4',
    section: 'Reasoning Ability',
    question: 'Statements:\n1. All engineers are graduates.\n2. Some graduates are artists.\n\nConclusions:\nI. All engineers are graduates.\nII. Some engineers are artists.\n\nWhich conclusion(s) logically follow?',
    options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither follows'],
    correctAnswer: 0,
    explanation: 'Conclusion I directly restates premise 1, so it is unconditionally valid. Conclusion II is not guaranteed because the set of artists may intersect only with non-engineer graduates.',
    topic: 'Syllogisms',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'log-5',
    section: 'Reasoning Ability',
    question: 'A is the brother of B. B is the mother of C. How is A related to C?',
    options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
    correctAnswer: 1,
    explanation: "Since B is the mother of C, and A is B's brother, A is the brother of C's mother, which is Maternal Uncle.",
    topic: 'Blood Relations',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-6',
    section: 'Reasoning Ability',
    question: 'In a single row of students, Rahul is 7th from the left end and 9th from the right end. How many students are there in the row?',
    options: ['14', '15', '16', '17'],
    correctAnswer: 1,
    explanation: 'Total students = (Position from left) + (Position from right) - 1 = 7 + 9 - 1 = 15.',
    topic: 'Ranking & Ordering',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-7',
    section: 'Reasoning Ability',
    question: 'Which of the following numbers is the odd one out: 16, 25, 36, 48?',
    options: ['16', '25', '36', '48'],
    correctAnswer: 3,
    explanation: '16 = 4², 25 = 5², and 36 = 6² are all perfect squares. 48 is not a perfect square.',
    topic: 'Classification',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-8',
    section: 'Reasoning Ability',
    question: 'If today is Wednesday, what day of the week will it be exactly 17 days from today?',
    options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
    correctAnswer: 1,
    explanation: '17 mod 7 = 3 days. Wednesday + 3 days (Thursday, Friday, Saturday) = Saturday.',
    topic: 'Calendar Logic',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'log-9',
    section: 'Reasoning Ability',
    question: 'In a code language, if CLOCK is coded as KCOLC, how will WATCH be written?',
    options: ['HCTAW', 'HCTWA', 'HTCAW', 'HAWCT'],
    correctAnswer: 0,
    explanation: 'The word is simply reversed: CLOCK -> K-C-O-L-C. Therefore, WATCH reversed is H-C-T-A-W.',
    topic: 'Coding-Decoding',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'log-10',
    section: 'Reasoning Ability',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the only son of my mother." How is Suresh related to that boy?',
    options: ['Father', 'Brother', 'Suresh himself', 'Cousin'],
    correctAnswer: 2,
    explanation: 'The only son of Suresh\'s mother is Suresh himself (assuming Suresh is male, as common in logical questions of this type).',
    topic: 'Blood Relations',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'log-11',
    section: 'Reasoning Ability',
    question: 'Five colleagues (P, Q, R, S, T) sit in a straight line facing North. Q is at the center. P is to the immediate left of Q. T is at the extreme right end. Where is S if R is to the immediate right of Q?',
    options: ['Extreme Left', 'Between P and Q', 'Between Q and R', 'Extreme Right'],
    correctAnswer: 0,
    explanation: 'Row has 5 spots: 1, 2, 3, 4, 5. Center (spot 3) = Q. Spot 2 (immediate left of Q) = P. Spot 4 (immediate right of Q) = R. Spot 5 (extreme right) = T. Spot 1 (extreme left) must be S.',
    topic: 'Linear Seating Arrangement',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'log-12',
    section: 'Reasoning Ability',
    question: 'Complete the letter series: B, D, G, K, P, ___',
    options: ['S', 'T', 'U', 'V'],
    correctAnswer: 3,
    explanation: 'Letter positions: B (2) + 2 = D (4); D (4) + 3 = G (7); G (7) + 4 = K (11); K (11) + 5 = P (16); P (16) + 6 = 22 = V.',
    topic: 'Letter Series',
    evidence: 'Candidate-Recalled',
    difficulty: 'Medium'
  },
  {
    id: 'log-13',
    section: 'Reasoning Ability',
    question: 'Statements:\n1. Some pens are books.\n2. All books are pencils.\n\nConclusions:\nI. Some pencils are pens.\nII. All books are pens.\n\nWhich follows?',
    options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither follows'],
    correctAnswer: 0,
    explanation: 'Since some pens are books and all books are pencils, those pens which are books must be pencils. Thus, "Some pencils are pens" definitely follows. Conclusion II is not guaranteed.',
    topic: 'Syllogisms',
    evidence: 'Candidate-Recalled',
    difficulty: 'Medium'
  },
  {
    id: 'log-14',
    section: 'Reasoning Ability',
    question: 'Find the missing number in the sequence: 4, 9, 19, 39, 79, ___',
    options: ['119', '139', '159', '169'],
    correctAnswer: 2,
    explanation: 'Pattern: (Previous number * 2) + 1. 4*2 + 1 = 9; 9*2 + 1 = 19; 19*2 + 1 = 39; 39*2 + 1 = 79; 79*2 + 1 = 159.',
    topic: 'Number Series',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'log-15',
    section: 'Reasoning Ability',
    question: 'A clock shows 3:00. What is the angle between the hour hand and the minute hand?',
    options: ['45 degrees', '60 degrees', '90 degrees', '120 degrees'],
    correctAnswer: 2,
    explanation: 'At 3:00, the minute hand is at 12 and the hour hand is at 3. The angle between them is 3 * 30° = 90 degrees.',
    topic: 'Clock Logic',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },

  // ==========================================
  // SECTION 2: MATHEMATICAL ABILITY (10 QUESTIONS)
  // ==========================================
  {
    id: 'math-1',
    section: 'Mathematical Ability',
    question: "A product's price increases by 20%. By what percentage must consumption decrease to keep total expenditure unchanged?",
    options: ['15%', '16.67%', '20%', '25%'],
    correctAnswer: 1,
    explanation: 'Formula: [R / (100 + R)] * 100 = [20 / 120] * 100 = 16.67%.',
    topic: 'Percentages',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'math-2',
    section: 'Mathematical Ability',
    question: 'A can finish a job in 12 days and B in 18 days. How long will they take working together to finish the same job?',
    options: ['6 days', '7.2 days', '8 days', '9 days'],
    correctAnswer: 1,
    explanation: "Combined rate = 1/12 + 1/18 = 5/36. Time required = 36 / 5 = 7.2 days.",
    topic: 'Time and Work',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'math-3',
    section: 'Mathematical Ability',
    question: 'A bag contains 4 red and 6 blue balls. One ball is selected at random. What is the probability of selecting a red ball?',
    options: ['2/5', '3/5', '1/2', '2/3'],
    correctAnswer: 0,
    explanation: 'Total balls = 4 + 6 = 10. Favorable outcomes = 4. Probability = 4 / 10 = 2/5.',
    topic: 'Probability',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'math-4',
    section: 'Mathematical Ability',
    question: 'In how many ways can 3 students be selected from a group of 7 students?',
    options: ['21', '28', '35', '42'],
    correctAnswer: 2,
    explanation: '7C3 = (7 * 6 * 5) / (3 * 2 * 1) = 210 / 6 = 35 ways.',
    topic: 'Permutations & Combinations',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'math-5',
    section: 'Mathematical Ability',
    question: 'The average of five numbers is 24. If one number, 30, is removed, what is the average of the remaining four numbers?',
    options: ['21.5', '22', '22.5', '23'],
    correctAnswer: 2,
    explanation: 'Sum of 5 numbers = 5 * 24 = 120. When 30 is removed, sum of remaining 4 numbers = 90. Average = 90 / 4 = 22.5.',
    topic: 'Averages',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'math-6',
    section: 'Mathematical Ability',
    question: 'A train 120 m long crosses a stationary pole in 6 seconds. What is its speed in km/h?',
    options: ['60 km/h', '66 km/h', '72 km/h', '80 km/h'],
    correctAnswer: 2,
    explanation: 'Speed = 120 m / 6 s = 20 m/s. Convert to km/h: 20 * (18 / 5) = 72 km/h.',
    topic: 'Speed, Time & Distance',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'math-7',
    section: 'Mathematical Ability',
    question: 'An item marked at INR 1,000 is sold at a 10% discount. If its cost price is INR 750, what is the profit percentage?',
    options: ['15%', '18%', '20%', '25%'],
    correctAnswer: 2,
    explanation: 'Selling price = 1000 - 100 = 900. Profit = 900 - 750 = 150. Profit % = (150 / 750) * 100 = 20%.',
    topic: 'Profit and Loss',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'math-8',
    section: 'Mathematical Ability',
    question: 'Find the next term: 3, 8, 15, 24, 35, ___',
    options: ['44', '46', '48', '50'],
    correctAnswer: 2,
    explanation: 'Differences are consecutive odd numbers: +5, +7, +9, +11. Next difference is +13 -> 35 + 13 = 48.',
    topic: 'Series Progression',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'math-9',
    section: 'Mathematical Ability',
    question: 'Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank completely?',
    options: ['10 mins', '12 mins', '15 mins', '16 mins'],
    correctAnswer: 1,
    explanation: 'Combined rate = 1/20 + 1/30 = (3 + 2)/60 = 5/60 = 1/12. Time = 12 minutes.',
    topic: 'Pipes and Cisterns',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'math-10',
    section: 'Mathematical Ability',
    question: 'A sum of money doubles itself in 5 years at simple interest. What is the annual rate of interest?',
    options: ['10%', '15%', '20%', '25%'],
    correctAnswer: 2,
    explanation: 'Let Principal = P. Simple Interest = P. Time = 5 years. SI = (P * R * T) / 100 -> P = (P * R * 5) / 100 -> R = 100 / 5 = 20%.',
    topic: 'Simple Interest',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },

  // ==========================================
  // SECTION 3: VERBAL ABILITY (20 QUESTIONS)
  // ==========================================
  {
    id: 'verb-1',
    section: 'Verbal Ability',
    question: 'Choose the grammatically correct sentence:',
    options: [
      "She don't work here.",
      "She doesn't works here.",
      "She doesn't work here.",
      "She not work here."
    ],
    correctAnswer: 2,
    explanation: '"She" takes third-person singular auxiliary "doesn\'t", followed by base verb "work".',
    topic: 'Grammar & Syntax',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'verb-2',
    section: 'Verbal Ability',
    question: 'Fill in the blank: "They have lived in Pune ___ 2021."',
    options: ['for', 'since', 'from', 'by'],
    correctAnswer: 1,
    explanation: '"Since" is used with a specific starting point in time (2021) with present perfect tense.',
    topic: 'Prepositions',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'verb-3',
    section: 'Verbal Ability',
    question: 'Choose the antonym of the word "SCARCE":',
    options: ['Rare', 'Limited', 'Abundant', 'Insufficient'],
    correctAnswer: 2,
    explanation: '"Scarce" means in short supply. Its direct antonym is "Abundant" (plentiful).',
    topic: 'Vocabulary',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'verb-4',
    section: 'Verbal Ability',
    question: 'Choose the synonym of "CONCISE":',
    options: ['Brief', 'Confusing', 'Lengthy', 'Unclear'],
    correctAnswer: 0,
    explanation: '"Concise" means giving a lot of information clearly and in few words; brief.',
    topic: 'Vocabulary',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'verb-5',
    section: 'Verbal Ability',
    question: 'Identify the error: "Neither of the two answers are correct."',
    options: ['Neither', 'of the two', 'are', 'correct'],
    correctAnswer: 2,
    explanation: '"Neither" is singular in formal grammar and takes the singular verb "is", not "are".',
    topic: 'Error Spotting',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'verb-6',
    section: 'Verbal Ability',
    question: 'Choose the correct article: "She is ___ honest employee."',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 1,
    explanation: '"Honest" begins with a silent \'h\' and a vowel sound (/ɒ/), requiring the indefinite article "an".',
    topic: 'Articles',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'verb-7',
    section: 'Verbal Ability',
    question: 'Choose the correct passive form: "The team completed the project."',
    options: [
      'The project completed by the team.',
      'The project was completed by the team.',
      'The project is completing by the team.',
      'The team was completed by the project.'
    ],
    correctAnswer: 1,
    explanation: 'Simple past active ("completed") changes to "was completed" in passive voice.',
    topic: 'Voice',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'verb-8',
    section: 'Verbal Ability',
    question: 'Select the correctly ordered sentence parts:\n(P) because the server failed\n(Q) the application stopped\n(R) unexpectedly',
    options: ['Q-R-P', 'P-Q-R', 'R-P-Q', 'Q-P-R'],
    correctAnswer: 0,
    explanation: '"The application stopped (Q) unexpectedly (R) because the server failed (P)." Sequence Q-R-P creates natural syntactic order.',
    topic: 'Para Jumbles',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'verb-9',
    section: 'Verbal Ability',
    question: 'Choose the correct spelling:',
    options: ['Occurence', 'Occurrence', 'Ocurrence', 'Occurrance'],
    correctAnswer: 1,
    explanation: 'The correct English spelling is "Occurrence" with double \'c\' and double \'r\'.',
    topic: 'Spelling',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'verb-10',
    section: 'Verbal Ability',
    question: 'Select the appropriate phrase: "The manager insisted ___ completing the module on time."',
    options: ['in', 'on', 'at', 'with'],
    correctAnswer: 1,
    explanation: 'The verb "insist" is idiomatically followed by the preposition "on" (insist on doing something).',
    topic: 'Prepositions',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'verb-11',
    section: 'Verbal Ability',
    question: 'What is the synonym of "METICULOUS"?',
    options: ['Careless', 'Careful & Detailed', 'Hasty', 'Aggressive'],
    correctAnswer: 1,
    explanation: '"Meticulous" means showing great attention to detail; very careful and precise.',
    topic: 'Vocabulary',
    evidence: 'Candidate-Recalled',
    difficulty: 'Medium'
  },
  {
    id: 'verb-12',
    section: 'Verbal Ability',
    question: 'Identify the error in: "Each of the participants have received a certificate of completion."',
    options: ['Each of the', 'participants', 'have received', 'certificate of completion'],
    correctAnswer: 2,
    explanation: '"Each" is singular and takes a singular verb: "has received", not "have received".',
    topic: 'Subject-Verb Agreement',
    evidence: 'Candidate-Recalled',
    difficulty: 'Medium'
  },
  {
    id: 'verb-13',
    section: 'Verbal Ability',
    question: 'Choose the antonym of "OBSOLETE":',
    options: ['Contemporary / Modern', 'Outdated', 'Antique', 'Ancient'],
    correctAnswer: 0,
    explanation: '"Obsolete" means no longer produced or used; out of date. Contemporary or modern is its antonym.',
    topic: 'Vocabulary',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'verb-14',
    section: 'Verbal Ability',
    question: 'Change into indirect speech: He said, "I am writing a report."',
    options: [
      'He said that he was writing a report.',
      'He said that I was writing a report.',
      'He says that he is writing a report.',
      'He said that he had written a report.'
    ],
    correctAnswer: 0,
    explanation: 'Present continuous ("am writing") converts to past continuous ("was writing") in reported speech when the reporting verb is in the past.',
    topic: 'Direct / Indirect Speech',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'verb-15',
    section: 'Verbal Ability',
    question: 'Fill in the blank: "Hardly had the meeting started ___ the power went out."',
    options: ['when', 'than', 'then', 'while'],
    correctAnswer: 0,
    explanation: 'The correlative conjunction pair is "Hardly / Scarcely ... when". ("No sooner ... than").',
    topic: 'Conjunctions',
    evidence: 'Candidate-Recalled',
    difficulty: 'Medium'
  },
  {
    id: 'verb-16',
    section: 'Verbal Ability',
    question: 'Read the short excerpt:\n"Continuous automation in cloud infrastructure reduces manual human intervention in deployment pipelines, allowing developer teams to focus predominantly on feature delivery and reliability engineering."\n\nAccording to the passage, what is the primary benefit of infrastructure automation?',
    options: [
      'Eliminating developer jobs entirely',
      'Freeing developers to concentrate on feature delivery and reliability',
      'Increasing manual review steps',
      'Reducing cloud server speed'
    ],
    correctAnswer: 1,
    explanation: 'The passage directly states that reducing manual intervention allows teams to "focus predominantly on feature delivery and reliability engineering".',
    topic: 'Reading Comprehension',
    evidence: 'Candidate-Recalled',
    difficulty: 'Easy'
  },
  {
    id: 'verb-17',
    section: 'Verbal Ability',
    question: 'Choose the word that means "a person who speaks multiple languages":',
    options: ['Polyglot', 'Philanthropist', 'Polymath', 'Linguist'],
    correctAnswer: 0,
    explanation: 'A "polyglot" is someone who knows and is able to use several languages.',
    topic: 'One Word Substitution',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-18',
    section: 'Verbal Ability',
    question: 'Select the appropriate word: "The company’s decision was praised for its ___ and transparency."',
    options: ['integrity', 'integration', 'intensity', 'interim'],
    correctAnswer: 0,
    explanation: '"Integrity" (the quality of being honest and having strong moral principles) pairs naturally with transparency in corporate governance.',
    topic: 'Sentence Completion',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'verb-19',
    section: 'Verbal Ability',
    question: 'Identify the sentence with correct punctuation:',
    options: [
      'Although it was raining, we decided to attend the seminar.',
      'Although it was raining we decided, to attend the seminar.',
      'Although, it was raining we decided to attend the seminar.',
      'Although it was raining; we decided to attend the seminar.'
    ],
    correctAnswer: 0,
    explanation: 'A dependent introductory clause ("Although it was raining") should be followed by a comma before the independent main clause.',
    topic: 'Punctuation',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-20',
    section: 'Verbal Ability',
    question: 'Choose the antonym of "TRANSPARENT":',
    options: ['Opaque', 'Lucid', 'Clear', 'Glassy'],
    correctAnswer: 0,
    explanation: '"Transparent" means allowing light to pass through so objects behind can be distinctly seen. "Opaque" means not able to be seen through; not transparent.',
    topic: 'Vocabulary',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },

  // ==========================================
  // SECTION 4: PSEUDOCODE (5 QUESTIONS)
  // ==========================================
  {
    id: 'pseudo-1',
    section: 'Pseudocode',
    question: 'What is printed by the following pseudocode?',
    codeSnippet: 'x = 3\ny = 2\nx = x + y * 2\nprint(x)',
    options: ['7', '10', '12', '5'],
    correctAnswer: 0,
    explanation: 'Operator precedence: multiplication happens before addition. y * 2 = 4. Then x = 3 + 4 = 7.',
    topic: 'Operator Precedence',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-2',
    section: 'Pseudocode',
    question: 'What is printed at the completion of this loop?',
    codeSnippet: 'sum = 0\nfor i = 1 to 4\n    sum = sum + i\nprint(sum)',
    options: ['6', '8', '10', '12'],
    correctAnswer: 2,
    explanation: 'Loop adds 1 + 2 + 3 + 4 = 10.',
    topic: 'Loops',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-3',
    section: 'Pseudocode',
    question: 'What will be output by this conditional block?',
    codeSnippet: 'a = 5\nif a % 2 == 0\n    print("Even")\nelse\n    print("Odd")',
    options: ['Even', 'Odd', '0', 'Error'],
    correctAnswer: 1,
    explanation: '5 modulo 2 is 1 (non-zero), so the else block executes and outputs "Odd".',
    topic: 'Conditionals',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-4',
    section: 'Pseudocode',
    question: 'What is the final value of variable x?',
    codeSnippet: 'x = 1\nfor i = 1 to 3\n    x = x * 2',
    options: ['4', '6', '8', '16'],
    correctAnswer: 2,
    explanation: 'Iteration 1: x=2. Iteration 2: x=4. Iteration 3: x=8.',
    topic: 'Loop Variables',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-5',
    section: 'Pseudocode',
    question: 'Which of the following data structures strictly follows Last-In, First-Out (LIFO) order?',
    options: ['Queue', 'Stack', 'Linked list', 'Tree'],
    correctAnswer: 1,
    explanation: 'A Stack follows LIFO (Last In, First Out). A Queue follows FIFO (First In, First Out).',
    topic: 'Data Structures',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },

  // ==========================================
  // SECTION 5: PUZZLE SOLVING (4 QUESTIONS)
  // ==========================================
  {
    id: 'puz-1',
    section: 'Puzzle Solving',
    question: 'Find the missing number in the grid pattern:\nRow 1: 2, 4, 8\nRow 2: 3, 6, 12\nRow 3: 5, 10, ___',
    options: ['15', '18', '20', '25'],
    correctAnswer: 2,
    explanation: 'Each row doubles from left to right: 5 * 2 = 10, 10 * 2 = 20.',
    topic: 'Number Grid Pattern',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'puz-2',
    section: 'Puzzle Solving',
    question: 'A two-digit number has digits whose sum is 9. The tens digit is 3 more than the units digit. What is the number?',
    options: ['36', '63', '54', '72'],
    correctAnswer: 1,
    explanation: 'Let units digit = u, tens digit = u + 3. (u + 3) + u = 9 -> 2u = 6 -> u = 3. Tens digit = 6. The number is 63.',
    topic: 'Digit Arithmetic',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'puz-3',
    section: 'Puzzle Solving',
    question: 'Three boxes are labelled "Apples", "Oranges", and "Mixed". You are told that EVERY label is completely wrong. You may take one fruit from one box. From which labelled box should you draw to determine the contents of all three boxes?',
    options: ['Apples', 'Oranges', 'Mixed', 'Any box'],
    correctAnswer: 2,
    explanation: 'Draw from the box labelled "Mixed". Because every label is wrong, this box cannot be mixed; it must contain exclusively apples or exclusively oranges. Drawing 1 fruit determines its identity. The other two boxes are then resolved by elimination.',
    topic: 'Deductive Logic',
    evidence: 'Official Sample',
    difficulty: 'Hard'
  },
  {
    id: 'puz-4',
    section: 'Puzzle Solving',
    question: 'Four people each shake hands with every other person in a room exactly once. How many total handshakes occur?',
    options: ['4', '5', '6', '8'],
    correctAnswer: 2,
    explanation: 'Number of pairs among 4 people = 4C2 = (4 * 3) / 2 = 6 handshakes.',
    topic: 'Combinatorics Logic',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  }
];

export const TECHNICAL_INTERVIEW_PROMPTS: InterviewPrompt[] = [
  {
    id: 'tech-1',
    category: 'Java & OOP',
    round: 'Technical Interview',
    tag: 'Infosys SE 2024–2025 Recent Drive',
    question: 'Explain the four fundamental pillars of Object-Oriented Programming (OOP) with a concise real-world software example.',
    expectedPoints: [
      'Encapsulation: Bundling data and methods into a single class with private variables and public getters/setters.',
      'Abstraction: Hiding internal implementation details and exposing only essential interfaces.',
      'Inheritance: Child class deriving attributes and behavior from a parent class to promote reusability.',
      'Polymorphism: Method Overloading (compile-time) and Method Overriding (runtime).'
    ],
    sampleAnswerGuide: 'Illustrate all 4 pillars using a single coherent analogy such as a Vehicle or Banking system.'
  },
  {
    id: 'tech-2',
    category: 'Java & OOP',
    round: 'Technical Interview',
    tag: 'Frequently Asked in Technical Round',
    question: 'What is the distinction between Method Overloading and Method Overriding in Java?',
    expectedPoints: [
      'Overloading is within the same class with different parameters (compile-time polymorphism).',
      'Overriding is between superclass and subclass with identical signature (runtime dynamic dispatch).'
    ],
    sampleAnswerGuide: 'Provide a 1-line syntax example showing both.'
  },
  {
    id: 'tech-3',
    category: 'DBMS & SQL',
    round: 'Technical Interview',
    tag: 'Infosys On-Campus Recalled',
    question: 'How do you find the second-highest salary from an Employee table in SQL?',
    expectedPoints: [
      'Subquery approach: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      'DENSE_RANK approach: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) WHERE rnk = 2;',
      'Handle duplicate salaries using DISTINCT.'
    ],
    sampleAnswerGuide: 'Mention the difference between dense_rank and standard limit offset for salary ties.'
  },
  {
    id: 'tech-4',
    category: 'DBMS & SQL',
    round: 'Technical Interview',
    tag: 'High Priority DBMS Concept',
    question: 'Explain Database Normalization and clearly differentiate 1NF, 2NF, and 3NF.',
    expectedPoints: [
      '1NF: Atomic values in each column; unique primary key.',
      '2NF: In 1NF and no partial dependency (non-prime attributes depend on full key).',
      '3NF: In 2NF and no transitive dependency (non-prime cannot depend on non-prime).'
    ],
    sampleAnswerGuide: 'Show how separating an Order table into Customers and Orders resolves 3NF.'
  },
  {
    id: 'tech-5',
    category: 'Operating Systems & Networks',
    round: 'Technical Interview',
    tag: 'Infosys SE Interview Theme',
    question: 'What is the difference between a Process and a Thread? How does Context Switching work between them?',
    expectedPoints: [
      'Process has its own isolated address space, heap, and memory mappings.',
      'Thread is a lightweight execution unit inside a process sharing memory.',
      'Thread context switching is much faster because CPU cache and TLB do not need full flush.'
    ],
    sampleAnswerGuide: 'Relate this to high-concurrency web servers.'
  },
  {
    id: 'tech-6',
    category: 'DSA & Problem Solving',
    round: 'Technical Interview',
    tag: 'Live Coding / Pseudo prompt',
    question: 'How do you check whether a given string is a palindrome without using built-in reverse functions? What is its time complexity?',
    expectedPoints: [
      'Two-pointer approach: left at index 0 and right at length - 1.',
      'Compare characters while left < right, incrementing left and decrementing right.',
      'Time complexity O(N), Space complexity O(1) in-place.'
    ],
    sampleAnswerGuide: 'Mention edge cases: single character string and empty string.'
  },
  {
    id: 'tech-7',
    category: 'Projects & Resume',
    round: 'Technical Interview',
    tag: 'Candidate-Reported High Impact',
    question: 'Walk me through the architecture of your primary college or internship project. What was the most challenging bug you solved?',
    expectedPoints: [
      'State the target problem, user base, and tech stack chosen.',
      'Differentiate your individual module contributions from teammates.',
      'Explain a specific bug using STAR method (Situation, Task, Action, Result).'
    ],
    sampleAnswerGuide: 'Confidence and genuine ownership of code are the primary evaluation criteria.'
  }
];

export const HR_INTERVIEW_PROMPTS: InterviewPrompt[] = [
  {
    id: 'hr-1',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Mandatory HR Round Question',
    question: 'Tell me about yourself, your academic background, and why you want to start your engineering career at Infosys.',
    expectedPoints: [
      'Structured 90-second elevator pitch: degree, branch, key technical passions.',
      'Highlight 1-2 notable projects or hackathons.',
      'Mention Infosys Mysuru GEC training and Springboard skilling culture.',
      'Express genuine enthusiasm for enterprise software delivery.'
    ],
    sampleAnswerGuide: 'Keep personal details to 1 sentence; dedicate 80% to technical aptitude, eagerness to learn, and career goals.'
  },
  {
    id: 'hr-2',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Infosys Standard Placement Policy',
    question: 'Are you completely open to relocating to any Infosys Development Center across India, and willing to work on any assigned technology stack?',
    expectedPoints: [
      'Unconditional positive confirmation: "Yes, I am fully open to relocating to any development center across India."',
      'Explain that at the beginning of your software career, versatility and technical breadth are your highest priorities.'
    ],
    sampleAnswerGuide: 'Never state restrictive conditions (e.g., "only Pune"). Infosys prioritizes candidates with geographic and tech flexibility.'
  },
  {
    id: 'hr-3',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Behavioral / Conflict Resolution',
    question: 'Describe a situation in a team project where you had a difference of opinion with a colleague. How did you resolve it?',
    expectedPoints: [
      'Focusing objectively on data and requirements rather than personal ego.',
      'Active listening to understand the peer’s perspective.',
      'Prototyping or testing both alternatives to evaluate measurable results.',
      'Reaching a unified team consensus.'
    ],
    sampleAnswerGuide: 'Use the STAR framework to highlight emotional maturity and collaborative spirit.'
  },
  {
    id: 'hr-4',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Long-term Career Vision',
    question: 'Where do you see yourself in 3 to 5 years at Infosys?',
    expectedPoints: [
      'Transitioning from Systems Engineer to Senior Systems Engineer / Technology Analyst.',
      'Deepening expertise in cloud architecture, fullstack, or AI platforms.',
      'Taking ownership of client modules and mentoring incoming trainees.'
    ],
    sampleAnswerGuide: 'Show realistic ambition aligned with the Infosys corporate career ladder.'
  }
];
