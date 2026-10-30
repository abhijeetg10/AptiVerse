export interface InfosysQuestion {
  id: string;
  section: 'Mathematical Ability' | 'Logical Reasoning' | 'Verbal Ability' | 'Pseudocode' | 'Puzzle Solving';
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  topic: string;
  evidence: 'Official Sample' | 'Candidate-Recalled' | 'Standard Practice';
  difficulty: 'Easy' | 'Medium' | 'Hard';
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

export const INFOSYS_COMPANY_OVERVIEW = {
  companyName: 'Infosys Limited',
  targetRole: 'Systems Engineer / Systems Engineer Trainee',
  referencePackage: 'INR 3.6 LPA',
  packageNote: 'Reported campus offer for recent drives (including 2026–2027 batch campus notices). Package is drive-specific and determined by the official offer letter.',
  relatedRoles: [
    { title: 'Systems Engineer (SE)', package: 'INR 3.6 LPA', desc: 'Entry-level technology role for engineering and MCA graduates.' },
    { title: 'Digital Specialist Engineer (DSE)', package: 'INR 6.25 - 6.5 LPA', desc: 'Specialized higher-tier hiring track focusing on advanced development.' },
    { title: 'Specialist Programmer (SP)', package: 'INR 9.5 LPA', desc: 'High-intensity competitive programming track through HackWithInfy.' }
  ],
  locations: [
    'Bengaluru', 'Pune', 'Hyderabad', 'Chennai', 'Bhubaneswar', 'Chandigarh', 
    'Coimbatore', 'Gurugram', 'Indore', 'Jaipur', 'Kolkata', 'Mangaluru', 'Mysuru', 'Mohali'
  ],
  trainingInfo: 'Campus hires typically undergo a 19 to 23-week world-class Foundation Program at the Global Education Center (GEC) in Mysuru, covering full-stack technologies, enterprise architecture, and professional skills.',
  eligibilityNotes: [
    'Typically 60% or above in Class 10 & 12, and 65% or 6.5+ CGPA in B.Tech / B.E. / M.Tech / MCA (specific criteria varies by drive).',
    'Open to all engineering branches (CSE, IT, ECE, EEE, Mechanical, Civil, etc.) unless specified otherwise by the campus placement cell.',
    'Maximum allowed active backlogs is strictly 0 at the time of joining.',
    'Maximum allowable academic gap is typically 1 to 2 years with valid documentation.'
  ],
  disclaimer: 'This is an independent educational preparation resource created for AptiVerse users. It is not affiliated with, endorsed by, or operated by Infosys Limited. Always verify test patterns and criteria against your official recruitment invite.'
};

export const INFOSYS_SELECTION_ROUNDS = [
  {
    roundNumber: 0,
    title: 'Registration & Verification',
    badge: 'Administrative',
    time: 'Pre-drive',
    desc: 'Campus placement cell registration or InfyTQ/careers portal application. Verification of academic credentials and candidate eligibility.'
  },
  {
    roundNumber: 1,
    title: 'Online Aptitude & Reasoning Assessment',
    badge: 'Elimination Round',
    time: '100 - 120 mins',
    desc: 'Automated screening assessment covering Reasoning, Math, Verbal, Pseudocode, and Puzzle Solving. No negative marking in standard drives, but strict sectional cutoffs apply.'
  },
  {
    roundNumber: 2,
    title: 'Technical Interview',
    badge: 'Evaluative Round',
    time: '25 - 40 mins',
    desc: '1-on-1 virtual discussion assessing core programming (Java/Python/C++), OOP concepts, DBMS/SQL queries, data structures, and in-depth questioning on your academic/internship projects.'
  },
  {
    roundNumber: 3,
    title: 'HR & Behavioral Discussion',
    badge: 'Final Round',
    time: '15 - 20 mins',
    desc: 'Assessment of communication skills, cultural fit, willingness to relocate to any Infosys DC, adaptability to assigned project tech stacks, and career aspirations.'
  }
];

export const INFOSYS_ASSESSMENT_FORMATS = [
  {
    name: 'Format A – Standard 5-Section Pattern (Historical & Sample Paper)',
    totalQuestions: 54,
    totalTimeMinutes: 100,
    sections: [
      { name: 'Reasoning Ability', questions: 15, timeMinutes: 25 },
      { name: 'Mathematical Ability', questions: 10, timeMinutes: 35 },
      { name: 'Verbal Ability', questions: 20, timeMinutes: 20 },
      { name: 'Pseudocode', questions: 5, timeMinutes: 10 },
      { name: 'Puzzle Solving', questions: 4, timeMinutes: 10 }
    ]
  },
  {
    name: 'Format B – 7-Part Pattern (Candidate Reported)',
    totalQuestions: 60,
    totalTimeMinutes: 120,
    sections: [
      { name: 'Logical Ability', questions: 15, timeMinutes: 25 },
      { name: 'Technical / Quantitative Ability', questions: 10, timeMinutes: 35 },
      { name: 'Verbal Ability', questions: 20, timeMinutes: 20 },
      { name: 'Pseudocode', questions: 5, timeMinutes: 10 },
      { name: 'Puzzle Solving', questions: 4, timeMinutes: 10 },
      { name: 'English Grammar', questions: 5, timeMinutes: 10 },
      { name: 'English Writing (Short Essay)', questions: 1, timeMinutes: 10 }
    ]
  }
];

export const INFOSYS_SYLLABUS = [
  {
    section: 'Mathematical Ability',
    topics: [
      'Number System, Divisibility & Remainders',
      'HCF and LCM',
      'Percentages & Profit/Loss/Discount',
      'Ratio & Proportion, Mixtures & Alligations',
      'Time and Work, Pipes and Cisterns',
      'Speed, Time and Distance (Trains, Boats & Streams)',
      'Simple and Compound Interest',
      'Permutations, Combinations & Probability',
      'Averages and Age Problems',
      'Algebra, Equations & Geometry / Mensuration',
      'Data Interpretation (Tables, Pie Charts, Bar Graphs)'
    ]
  },
  {
    section: 'Logical & Analytical Reasoning',
    topics: [
      'Number, Alphabet and Alphanumeric Series',
      'Coding and Decoding (Shifts & Substitution)',
      'Blood Relations & Family Tree Deduction',
      'Direction and Distance Sense Test',
      'Linear and Circular Seating Arrangements',
      'Ordering and Ranking',
      'Syllogisms (Venn diagram deduction)',
      'Statement & Assumptions / Conclusions',
      'Data Sufficiency',
      'Pattern Completion and Analogy',
      'Scheduling & Constraint-based Puzzles'
    ]
  },
  {
    section: 'Verbal Ability & English Grammar',
    topics: [
      'Reading Comprehension (Passage analysis & inference)',
      'Error Spotting & Sentence Correction',
      'Subject-Verb Agreement rules',
      'Tenses, Prepositions & Articles',
      'Synonyms and Antonyms in Context',
      'Sentence Completion & Fill in the Blanks',
      'Para Jumbles (Sentence reordering)',
      'Active and Passive Voice',
      'Direct and Indirect Speech'
    ]
  },
  {
    section: 'Pseudocode & Programming Logic',
    topics: [
      'Variable scope, data types and operators precedence',
      'Pre-increment and post-increment nuances (++i vs i++)',
      'Conditional branching (if-else, switch case)',
      'Loops, nested iterations & break/continue conditions',
      'Array manipulation and matrix traversal',
      'Function calls, parameters and recursion tracing',
      'Bitwise operators (&, |, ^, <<, >>)',
      'Code tracing and predicting console output',
      'Basic data structures: Stacks (LIFO), Queues (FIFO), Trees',
      'Algorithm time complexities (O(1), O(log n), O(n), O(n²))'
    ]
  },
  {
    section: 'Puzzle Solving',
    topics: [
      '3x3 & 4x4 Number grids with missing values',
      'Figure-based numerical logic & geometric patterns',
      'Mislabelled box deduction puzzles',
      'Handshake & combinatorics logic puzzles',
      'Digit-sum and cryptarithm arithmetic reasoning',
      'Weighing scales and counterfeit coin deductions'
    ]
  }
];

export const MOCK_TEST_QUESTIONS: InfosysQuestion[] = [
  // --- Mathematical Ability ---
  {
    id: 'math-1',
    section: 'Mathematical Ability',
    question: "A product's price increases by 20%. By what percentage must consumption decrease to keep total expenditure unchanged?",
    options: ['15%', '16.67%', '20%', '25%'],
    correctAnswer: 1,
    explanation: 'Let original price = 100 and consumption = 100, so spend = 10,000. New price = 120. New consumption = 10,000 / 120 = 83.33 units. Reduction required = 100 - 83.33 = 16.67% (or formula: [R / (100 + R)] * 100 = [20 / 120] * 100 = 16.67%).',
    topic: 'Percentages',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'math-2',
    section: 'Mathematical Ability',
    question: 'A can finish a job in 12 days and B in 18 days. How long will they take working together to complete the same job?',
    options: ['6 days', '7.2 days', '8 days', '9 days'],
    correctAnswer: 1,
    explanation: "A's 1-day work = 1/12, B's 1-day work = 1/18. Combined 1-day work = 1/12 + 1/18 = (3 + 2)/36 = 5/36. Total days required = 36 / 5 = 7.2 days.",
    topic: 'Time and Work',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'math-3',
    section: 'Mathematical Ability',
    question: 'A bag contains 4 red and 6 blue balls. One ball is selected at random. What is the probability of selecting a red ball?',
    options: ['2/5', '3/5', '1/2', '2/3'],
    correctAnswer: 0,
    explanation: 'Total balls = 4 + 6 = 10. Favorable outcomes (red) = 4. Probability = 4 / 10 = 2/5.',
    topic: 'Probability',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'math-4',
    section: 'Mathematical Ability',
    question: 'In how many ways can a team of 3 students be selected from a class of 7 students?',
    options: ['21', '28', '35', '42'],
    correctAnswer: 2,
    explanation: 'Number of ways = 7C3 = (7 * 6 * 5) / (3 * 2 * 1) = 210 / 6 = 35 ways.',
    topic: 'Permutations & Combinations',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'math-5',
    section: 'Mathematical Ability',
    question: 'The average of five numbers is 24. If one number, 30, is removed, what is the average of the remaining four numbers?',
    options: ['21.5', '22', '22.5', '23'],
    correctAnswer: 2,
    explanation: 'Sum of 5 numbers = 5 * 24 = 120. When 30 is removed, sum of remaining 4 numbers = 120 - 30 = 90. New average = 90 / 4 = 22.5.',
    topic: 'Averages',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'math-6',
    section: 'Mathematical Ability',
    question: 'A train 120 m long crosses a stationary telegraph pole in 6 seconds. What is the speed of the train in km/h?',
    options: ['60 km/h', '66 km/h', '72 km/h', '80 km/h'],
    correctAnswer: 2,
    explanation: 'Speed in m/s = Distance / Time = 120 m / 6 s = 20 m/s. Convert to km/h by multiplying by 18/5: 20 * (18 / 5) = 72 km/h.',
    topic: 'Speed, Time and Distance',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'math-7',
    section: 'Mathematical Ability',
    question: 'An item marked at INR 1,000 is sold at a 10% discount. If the cost price of the item is INR 750, what is the profit percentage?',
    options: ['15%', '18%', '20%', '25%'],
    correctAnswer: 2,
    explanation: 'Selling Price = 1,000 - 10% of 1,000 = INR 900. Cost Price = INR 750. Profit = 900 - 750 = INR 150. Profit % = (150 / 750) * 100 = 20%.',
    topic: 'Profit and Loss',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'math-8',
    section: 'Mathematical Ability',
    question: 'Find the next term in the sequence: 3, 8, 15, 24, 35, ___',
    options: ['44', '46', '48', '50'],
    correctAnswer: 2,
    explanation: 'Check differences between consecutive terms: 8 - 3 = 5, 15 - 8 = 7, 24 - 15 = 9, 35 - 24 = 11. The differences are consecutive odd numbers (+5, +7, +9, +11). Next difference is +13. Therefore, 35 + 13 = 48. (Alternatively, formula n² + 2n: 1*3, 2*4, 3*5, 4*6, 5*7, 6*8 = 48).',
    topic: 'Number Series',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },

  // --- Logical Reasoning ---
  {
    id: 'log-1',
    section: 'Logical Reasoning',
    question: 'Find the next term in the series: 2, 6, 12, 20, 30, ___',
    options: ['36', '40', '42', '44'],
    correctAnswer: 2,
    explanation: 'Each term is given by n * (n + 1): 1*2 = 2, 2*3 = 6, 3*4 = 12, 4*5 = 20, 5*6 = 30. The next term is 6 * 7 = 42. (Or differences: +4, +6, +8, +10, +12 -> 30 + 12 = 42).',
    topic: 'Number Series',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'log-2',
    section: 'Logical Reasoning',
    question: 'In a certain code, if CAT is coded as DBU by shifting each letter one position forward (+1), how will DOG be coded in the same pattern?',
    options: ['EPH', 'CNG', 'FQI', 'EOG'],
    correctAnswer: 0,
    explanation: 'Each character shifts +1: D -> E, O -> P, G -> H. Result is EPH.',
    topic: 'Coding-Decoding',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'log-3',
    section: 'Logical Reasoning',
    question: 'A person walks 5 km North, turns right and walks 3 km East, and then turns right again and walks 5 km South. Where is the person located relative to their starting point?',
    options: ['3 km East', '3 km West', '5 km North', 'At the starting point'],
    correctAnswer: 0,
    explanation: 'North (5 km) and South (5 km) cancel each other out on the vertical axis. The net displacement remains 3 km East of the origin.',
    topic: 'Direction Sense',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'log-4',
    section: 'Logical Reasoning',
    question: 'Statements:\n1. All engineers are graduates.\n2. Some graduates are artists.\n\nConclusions:\nI. All engineers are graduates.\nII. Some engineers are artists.\n\nWhich conclusion(s) logically follow?',
    options: ['Only I follows', 'Only II follows', 'Both I and II follow', 'Neither follows'],
    correctAnswer: 0,
    explanation: 'Conclusion I directly restates premise 1, so it is unconditionally valid. Conclusion II is not guaranteed because the intersection of graduates and artists may not overlap with engineers.',
    topic: 'Syllogisms',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'log-5',
    section: 'Logical Reasoning',
    question: 'A is the brother of B. B is the mother of C. How is A related to C?',
    options: ['Father', 'Maternal Uncle', 'Brother', 'Grandfather'],
    correctAnswer: 1,
    explanation: "Since B is the mother of C, and A is B's brother, A is the brother of C's mother, which is Maternal Uncle.",
    topic: 'Blood Relations',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'log-6',
    section: 'Logical Reasoning',
    question: 'In a single row of students, Rahul is 7th from the left end and 9th from the right end. How many students are there in the row?',
    options: ['14', '15', '16', '17'],
    correctAnswer: 1,
    explanation: 'Total students = (Position from left) + (Position from right) - 1 = 7 + 9 - 1 = 15.',
    topic: 'Ranking & Ordering',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'log-7',
    section: 'Logical Reasoning',
    question: 'Which of the following numbers is the odd one out: 16, 25, 36, 48?',
    options: ['16', '25', '36', '48'],
    correctAnswer: 3,
    explanation: '16 = 4², 25 = 5², and 36 = 6² are all perfect squares. 48 is not a perfect square.',
    topic: 'Classification / Odd One Out',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'log-8',
    section: 'Logical Reasoning',
    question: 'If today is Wednesday, what day of the week will it be exactly 17 days from today?',
    options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
    correctAnswer: 1,
    explanation: '17 divided by 7 yields 2 weeks with a remainder of 3 days (17 mod 7 = 3). Wednesday + 3 days (Thu, Fri, Sat) = Saturday.',
    topic: 'Calendar Logic',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },

  // --- Verbal Ability & English Grammar ---
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
    explanation: 'Third-person singular "she" takes auxiliary "does not" / "doesn\'t", followed by the base form of the principal verb "work".',
    topic: 'Subject-Verb Agreement',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-2',
    section: 'Verbal Ability',
    question: 'Fill in the blank with the appropriate preposition: "They have lived in Pune ___ 2021."',
    options: ['for', 'since', 'from', 'by'],
    correctAnswer: 1,
    explanation: '"Since" is used with a specific point in past time (2021) in present perfect continuous / present perfect tense.',
    topic: 'Prepositions',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-3',
    section: 'Verbal Ability',
    question: 'Choose the exact antonym of the word "SCARCE":',
    options: ['Rare', 'Limited', 'Abundant', 'Insufficient'],
    correctAnswer: 2,
    explanation: '"Scarce" means occurring in small quantities or insufficient. Its opposite is "Abundant" (existing in large quantities).',
    topic: 'Vocabulary / Antonyms',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-4',
    section: 'Verbal Ability',
    question: 'Choose the closest synonym for the word "CONCISE":',
    options: ['Brief', 'Confusing', 'Lengthy', 'Unclear'],
    correctAnswer: 0,
    explanation: '"Concise" means giving a lot of information clearly and in few words; brief but comprehensive.',
    topic: 'Vocabulary / Synonyms',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-5',
    section: 'Verbal Ability',
    question: 'Identify the part containing an error in the sentence: "Neither of the two answers are correct."',
    options: ['Neither', 'of the two', 'are', 'correct'],
    correctAnswer: 2,
    explanation: '"Neither" functions as a singular subject pronoun in formal English; it requires the singular auxiliary verb "is", not "are". Correct: "Neither of the two answers is correct."',
    topic: 'Error Spotting',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },
  {
    id: 'verb-6',
    section: 'Verbal Ability',
    question: 'Choose the correct article for the blank: "She is ___ honest employee."',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 1,
    explanation: 'Although "honest" begins with the consonant letter \'h\', it begins with a vowel sound (/ɒ/), requiring the indefinite article "an".',
    topic: 'Articles',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-7',
    section: 'Verbal Ability',
    question: 'Choose the correct passive voice transformation: "The team completed the project."',
    options: [
      'The project completed by the team.',
      'The project was completed by the team.',
      'The project is completing by the team.',
      'The team was completed by the project.'
    ],
    correctAnswer: 1,
    explanation: 'Simple past tense active ("completed") transforms into "was/were + past participle" ("was completed") in the passive voice.',
    topic: 'Voice Transformation',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'verb-8',
    section: 'Verbal Ability',
    question: 'Select the correctly ordered sequence to form a coherent sentence:\n(P) because the server failed\n(Q) the application stopped\n(R) unexpectedly',
    options: ['Q-R-P', 'P-Q-R', 'R-P-Q', 'Q-P-R'],
    correctAnswer: 0,
    explanation: '"The application stopped (Q) unexpectedly (R) because the server failed (P)." Sequence Q-R-P creates standard subject-verb-adverb-clause order.',
    topic: 'Para Jumbles',
    evidence: 'Standard Practice',
    difficulty: 'Medium'
  },

  // --- Pseudocode / Programming Logic ---
  {
    id: 'pseudo-1',
    section: 'Pseudocode',
    question: 'What is printed by the following pseudocode snippet?',
    codeSnippet: 'x = 3\ny = 2\nx = x + y * 2\nprint(x)',
    options: ['7', '10', '12', '5'],
    correctAnswer: 0,
    explanation: 'Operator precedence dictates multiplication happens before addition: y * 2 = 2 * 2 = 4. Then x = 3 + 4 = 7.',
    topic: 'Operator Precedence',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-2',
    section: 'Pseudocode',
    question: 'What is printed at the conclusion of this loop?',
    codeSnippet: 'sum = 0\nfor i = 1 to 4\n    sum = sum + i\nprint(sum)',
    options: ['6', '8', '10', '12'],
    correctAnswer: 2,
    explanation: 'The loop executes for i = 1, 2, 3, 4. sum = 0 + 1 + 2 + 3 + 4 = 10.',
    topic: 'Loops and Iterations',
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
    explanation: '5 modulo 2 yields a remainder of 1 (1 != 0), so the else block executes and prints "Odd".',
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
    explanation: 'Initially x = 1. Iteration 1: x = 1 * 2 = 2. Iteration 2: x = 2 * 2 = 4. Iteration 3: x = 4 * 2 = 8.',
    topic: 'Loop Variables',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-5',
    section: 'Pseudocode',
    question: 'Which of the following data structures follows Last-In, First-Out (LIFO) order?',
    options: ['Queue', 'Stack', 'Linked List', 'Binary Tree'],
    correctAnswer: 1,
    explanation: 'A Stack strictly adheres to LIFO (Last In First Out) semantics. A Queue follows FIFO (First In First Out).',
    topic: 'Data Structures',
    evidence: 'Standard Practice',
    difficulty: 'Easy'
  },
  {
    id: 'pseudo-6',
    section: 'Pseudocode',
    question: 'What is printed? (Assume "/" performs standard real-number division)',
    codeSnippet: 'a = 10\nb = 3\nprint(a / b)',
    options: ['3', '3.33...', '30', '1'],
    correctAnswer: 1,
    explanation: 'Under real-number division, 10 / 3 evaluates to repeating decimal 3.333... If integer floor division were used it would be 3, but the specification specifies real division.',
    topic: 'Data Types & Arithmetic',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  },

  // --- Puzzle Solving ---
  {
    id: 'puz-1',
    section: 'Puzzle Solving',
    question: 'Find the missing number in this pattern:\nRow 1: 2, 4, 8\nRow 2: 3, 6, 12\nRow 3: 5, 10, ___',
    options: ['15', '18', '20', '25'],
    correctAnswer: 2,
    explanation: 'In each row, numbers double from left to right: Row 1: 2 * 2 = 4, 4 * 2 = 8. Row 2: 3 * 2 = 6, 6 * 2 = 12. Row 3: 5 * 2 = 10, 10 * 2 = 20.',
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
    explanation: 'Let units digit = u, tens digit = t = u + 3. Given t + u = 9 -> (u + 3) + u = 9 -> 2u = 6 -> u = 3. Tens digit t = 3 + 3 = 6. The number is 63.',
    topic: 'Digit Arithmetic Puzzle',
    evidence: 'Official Sample',
    difficulty: 'Medium'
  },
  {
    id: 'puz-3',
    section: 'Puzzle Solving',
    question: 'Three fruit boxes are labelled "Apples", "Oranges", and "Mixed". You are told that EVERY box is labelled incorrectly. You are permitted to draw exactly ONE fruit from ONE box without looking inside. From which labelled box must you draw to identify the contents of all three boxes?',
    options: ['The box labelled Apples', 'The box labelled Oranges', 'The box labelled Mixed', 'Any box at random'],
    correctAnswer: 2,
    explanation: 'Draw from the box labelled "Mixed". Because all labels are wrong, that box CANNOT be mixed; it must be either all apples or all oranges. If you draw an apple, that box is Apples. Then the box labelled "Oranges" cannot be oranges (wrong label) and cannot be apples (already found), so it must be Mixed. The remaining box labelled "Apples" is Oranges.',
    topic: 'Deductive Logic Puzzle',
    evidence: 'Official Sample',
    difficulty: 'Hard'
  },
  {
    id: 'puz-4',
    section: 'Puzzle Solving',
    question: 'Four team members meet in a room and each person shakes hands with every other person exactly once. How many total handshakes occur?',
    options: ['4', '5', '6', '8'],
    correctAnswer: 2,
    explanation: 'Number of handshakes among n people is nC2 = [n * (n - 1)] / 2. For n = 4: [4 * 3] / 2 = 6 handshakes.',
    topic: 'Combinatorics Logic',
    evidence: 'Official Sample',
    difficulty: 'Easy'
  }
];

export const INTERVIEW_QUESTIONS: InterviewPrompt[] = [
  // --- Technical: Java & OOP ---
  {
    id: 'int-java-1',
    category: 'Java & OOP',
    round: 'Technical Interview',
    tag: 'Infosys SE 2024–2025 Recent Drive',
    question: 'Explain the four fundamental pillars of Object-Oriented Programming (OOP) with a concise real-world software example.',
    expectedPoints: [
      'Encapsulation: Bundling data and methods into a single class with private variables and public getters/setters (e.g. BankAccount balance).',
      'Abstraction: Hiding internal implementation complexities and showing only essential features via abstract classes or interfaces (e.g. Car accelerator pedal).',
      'Inheritance: Mechanism where child class derives properties and behaviors from parent class, promoting reusability (e.g. ElectricCar extends Vehicle).',
      'Polymorphism: Ability to take many forms through Compile-time (Method Overloading) and Runtime (Method Overriding with @Override).'
    ],
    sampleAnswerGuide: 'Structure your answer around a single consistent metaphor (like an E-Commerce or Banking system) so the interviewer sees practical system architecture intuition.'
  },
  {
    id: 'int-java-2',
    category: 'Java & OOP',
    round: 'Technical Interview',
    tag: 'Frequently Asked in Technical Round',
    question: 'What is the distinction between Method Overloading and Method Overriding in Java?',
    expectedPoints: [
      'Overloading occurs within the same class; Overriding occurs between superclass and subclass.',
      'Overloading requires different method signatures (number or types of parameters); Overriding requires identical method signature and return type.',
      'Overloading is resolved at compile-time (static polymorphism); Overriding is resolved at runtime (dynamic method dispatch).'
    ],
    sampleAnswerGuide: 'Provide a 1-line code example: calculateArea(int r) vs calculateArea(int l, int b) for overloading; animal.makeSound() overridden by Dog for overriding.'
  },
  {
    id: 'int-java-3',
    category: 'Java & OOP',
    round: 'Technical Interview',
    tag: 'Core Java Fundamentals',
    question: 'What is the difference between String, StringBuilder, and StringBuffer in Java?',
    expectedPoints: [
      'String objects are immutable (stored in the String Constant Pool); any modification produces a new object.',
      'StringBuilder is mutable and non-synchronized, providing high performance for single-threaded string manipulations.',
      'StringBuffer is mutable and synchronized (thread-safe), which incurs extra overhead in multi-threaded environments.'
    ],
    sampleAnswerGuide: 'Highlight that in modern single-threaded web backend services or loops, StringBuilder is almost always preferred over String concatenation.'
  },

  // --- Technical: DBMS & SQL ---
  {
    id: 'int-dbms-1',
    category: 'DBMS & SQL',
    round: 'Technical Interview',
    tag: 'Infosys On-Campus Recalled',
    question: 'How do you find the second-highest salary from an Employee table? Can you write both a subquery and a LIMIT/OFFSET approach?',
    expectedPoints: [
      'Subquery approach: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      'DENSE_RANK approach: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk FROM Employee) WHERE rnk = 2;',
      'LIMIT / OFFSET approach: SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;'
    ],
    sampleAnswerGuide: 'Always mention handle for ties or duplicates by emphasizing DISTINCT or DENSE_RANK.'
  },
  {
    id: 'int-dbms-2',
    category: 'DBMS & SQL',
    round: 'Technical Interview',
    tag: 'High Priority DBMS Concept',
    question: 'Explain Database Normalization and clearly differentiate 1NF, 2NF, and 3NF.',
    expectedPoints: [
      'Normalization minimizes redundancy and prevents insertion, update, and deletion anomalies.',
      '1NF: Atomic column values (no multi-valued attributes) and unique primary key.',
      '2NF: Must be in 1NF and eliminate partial dependencies (every non-key attribute depends on whole primary key).',
      '3NF: Must be in 2NF and eliminate transitive dependencies (non-key attribute cannot depend on another non-key attribute).'
    ],
    sampleAnswerGuide: 'Show how splitting an OrderDetails table with customer phone into separate Customers and Orders tables solves 3NF.'
  },
  {
    id: 'int-dbms-3',
    category: 'DBMS & SQL',
    round: 'Technical Interview',
    tag: 'SQL Syntax & Transactions',
    question: 'What is the difference between DELETE, TRUNCATE, and DROP statements in SQL?',
    expectedPoints: [
      'DELETE is a DML command that removes specific rows based on WHERE clause; can be rolled back inside a transaction; triggers activate.',
      'TRUNCATE is a DDL command that deallocates all pages of a table rapidly; cannot be rolled back easily in many DBs; does not fire delete triggers.',
      'DROP is a DDL command that completely deletes both table data and its schema definition from the database.'
    ],
    sampleAnswerGuide: 'Speed comparison: DROP is instantaneous, TRUNCATE is very fast, DELETE is slowest because it writes row-by-row undo logs.'
  },

  // --- Technical: Operating Systems & Networks ---
  {
    id: 'int-os-1',
    category: 'Operating Systems & Networks',
    round: 'Technical Interview',
    tag: 'Infosys SE Interview Theme',
    question: 'What is the difference between a Process and a Thread? How does Context Switching work between them?',
    expectedPoints: [
      'Process is an executing instance of a program with isolated address space, heap, and file descriptors.',
      'Thread is a lightweight unit of execution within a process that shares memory and resources with peer threads.',
      'Thread context switching is much faster because page directory and memory mappings do not need to be flushed from CPU cache.'
    ],
    sampleAnswerGuide: 'Mention practical impact on web servers (e.g. multi-threaded thread pools vs multi-process architectures).'
  },
  {
    id: 'int-os-2',
    category: 'Operating Systems & Networks',
    round: 'Technical Interview',
    tag: 'Candidate Reported',
    question: 'What exact steps occur behind the scenes when a user types a URL (e.g. https://www.aptiverse.in) into a web browser and hits Enter?',
    expectedPoints: [
      '1. Browser checks cache (browser, OS, router).',
      '2. DNS resolution (Recursive resolver -> Root -> TLD -> Authoritative server) to resolve IP.',
      '3. TCP 3-way handshake (SYN, SYN-ACK, ACK) establishes connection.',
      '4. TLS/SSL handshake negotiates cipher suite, verifies certificate, and exchanges encryption keys.',
      '5. Browser sends HTTP GET request; Server processes and returns HTTP 200 response with HTML/CSS/JS payload; Browser renders DOM.'
    ],
    sampleAnswerGuide: 'Walking systematically from DNS -> TCP -> TLS -> HTTP -> Browser Rendering proves exceptional full-stack awareness.'
  },

  // --- DSA & Problem Solving ---
  {
    id: 'int-dsa-1',
    category: 'DSA & Problem Solving',
    round: 'Technical Interview',
    tag: 'Live Coding / Pseudo prompt',
    question: 'How do you check whether a given string is a palindrome without using built-in reverse functions? What is the time and space complexity?',
    expectedPoints: [
      'Use the two-pointer approach: left pointer at index 0 and right pointer at length - 1.',
      'Compare characters at left and right while left < right. If characters differ, return false. Increment left and decrement right.',
      'Time complexity: O(n) because each character is checked at most once.',
      'Space complexity: O(1) auxiliary space as it works in-place.'
    ],
    sampleAnswerGuide: 'Mention edge cases: single character string (true), empty string (true), case-insensitivity or ignoring whitespace if required.'
  },

  // --- Projects & Resume Discussion ---
  {
    id: 'int-proj-1',
    category: 'Projects & Resume',
    round: 'Technical Interview',
    tag: 'Candidate-Reported High Impact',
    question: 'Walk me through the architecture of your primary resume project. What was the toughest technical bug you personally solved?',
    expectedPoints: [
      'State the core user problem and target audience.',
      'Explain frontend, backend API, database choice, and authentication flow.',
      'Clearly specify YOUR personal contributions vs team members.',
      'Describe a real bug using STAR method: Situation, Task, Root Cause / Action taken, and measurable Result.'
    ],
    sampleAnswerGuide: 'Interviewers look for genuine ownership: be ready to explain why you chose PostgreSQL or MongoDB over alternatives.'
  },

  // --- HR & Behavioral Questions ---
  {
    id: 'int-hr-1',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Mandatory HR Round Question',
    question: 'Tell me about yourself, your academic background, and why you want to start your engineering career specifically at Infosys.',
    expectedPoints: [
      'Succinct 90-second elevator pitch: current degree/branch, core technical interests.',
      'Highlight 1-2 notable projects or hackathons.',
      'Mention Infosys training culture (Global Education Center, Mysuru) and continuous skilling programs (Springboard).',
      'Express genuine enthusiasm for enterprise technology and scaling client solutions.'
    ],
    sampleAnswerGuide: 'Keep personal/family details to 1 sentence; devote 80% to technical aptitude, eagerness to learn, and professional drive.'
  },
  {
    id: 'int-hr-2',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Infosys Standard Placement Policy',
    question: 'Are you open to relocating to any Infosys Development Center across India, and are you willing to be trained in any technology stack based on business requirements?',
    expectedPoints: [
      'Resolute positive confirmation: "Yes, I am completely flexible to relocate to any development center across India."',
      'Explain that early in your career, learning versatility (Cloud, Java, Fullstack, AI) and exposure to diverse project domains is your highest priority.'
    ],
    sampleAnswerGuide: 'Never state conditional location preferences (e.g., "only if Bangalore"). Infosys expects geographic and technology flexibility from freshers.'
  },
  {
    id: 'int-hr-3',
    category: 'HR & Behavioral',
    round: 'HR Interview',
    tag: 'Behavioral / Conflict Resolution',
    question: 'Describe a situation during a team college project where you had a disagreement with a peer. How did you resolve it?',
    expectedPoints: [
      'Focus on objective ideas rather than personal ego or blame.',
      'Listening actively to the teammate’s perspective and assessing pros/cons.',
      'Testing or prototyping both approaches to evaluate data/performance.',
      'Reaching a unified consensus aligned with the project deadline.'
    ],
    sampleAnswerGuide: 'Use the STAR framework (Situation, Task, Action, Result) to showcase mature interpersonal skills and team-first orientation.'
  }
];
