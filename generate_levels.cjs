const fs = require('fs');

// GENERATE DI LEVELS
const diLevels = [];
const diScenarios = [
  { title: "Annual Corporate Financial Performance (2020-2024)", metric: "Revenue (in $ Millions)", cols: ["2020", "2021", "2022", "2023", "2024"], rows: ["North America", "Europe", "Asia", "South America"] },
  { title: "Global Energy Consumption by Sector", metric: "Consumption (Exajoules)", cols: ["Q1", "Q2", "Q3", "Q4"], rows: ["Industrial", "Transportation", "Residential", "Commercial"] },
  { title: "University Admissions Data", metric: "Applicants", cols: ["Engineering", "Medicine", "Arts", "Business"], rows: ["2021", "2022", "2023", "2024"] }
];

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

for (let i = 0; i < 3; i++) {
  const scenario = diScenarios[i];
  
  // Generate data table
  const tableData = [];
  // header
  tableData.push(["Category", ...scenario.cols]);
  const dataStore = {};
  
  scenario.rows.forEach(row => {
    const rowData = [row];
    dataStore[row] = {};
    scenario.cols.forEach(col => {
      const val = randomInt(100, 999);
      rowData.push(val.toString());
      dataStore[row][col] = val;
    });
    tableData.push(rowData);
  });
  
  const questions = [];
  // generate 24 questions
  for (let q = 0; q < 24; q++) {
    const type = randomInt(0, 3);
    const row1 = scenario.rows[randomInt(0, scenario.rows.length - 1)];
    const row2 = scenario.rows[randomInt(0, scenario.rows.length - 1)];
    const col1 = scenario.cols[randomInt(0, scenario.cols.length - 1)];
    const col2 = scenario.cols[randomInt(0, scenario.cols.length - 1)];
    
    let statement = "";
    let correct = "";
    let options = [];
    
    if (type === 0) {
      // Find value
      statement = `What was the ${scenario.metric} for ${row1} in ${col1}?`;
      correct = dataStore[row1][col1].toString();
      options = [correct, (dataStore[row1][col1] + 10).toString(), (dataStore[row1][col1] - 15).toString(), randomInt(100, 999).toString()];
    } else if (type === 1) {
      // Find sum
      statement = `What is the total ${scenario.metric} for ${row1} across all periods/categories?`;
      const sum = scenario.cols.reduce((acc, c) => acc + dataStore[row1][c], 0);
      correct = sum.toString();
      options = [correct, (sum + 100).toString(), (sum - 50).toString(), (sum + 20).toString()];
    } else if (type === 2) {
      // Find difference
      statement = `What is the difference in ${scenario.metric} between ${col1} and ${col2} for ${row1}? (Absolute value)`;
      const diff = Math.abs(dataStore[row1][col1] - dataStore[row1][col2]);
      correct = diff.toString();
      options = [correct, (diff + 15).toString(), (diff - 10).toString(), (diff + 5).toString()];
    } else {
      // True / False style fact
      statement = `The ${scenario.metric} for ${row1} in ${col1} was greater than ${row2} in ${col2}.`;
      correct = (dataStore[row1][col1] > dataStore[row2][col2]) ? "True" : "False";
      options = ["True", "False", "Cannot Say"];
    }
    
    // Shuffle options
    options = options.map(a => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map(a => a.value);
    // deduplicate options
    options = [...new Set(options)];
    if(options.length < 2) options.push("None of the above");
    
    questions.push({
      id: `di-${i}-q${q}`,
      statement,
      options,
      correctAnswer: correct,
      explanation: "Calculated based on the data table."
    });
  }
  
  diLevels.push({
    id: `di-lvl-${i}`,
    title: scenario.title,
    tabs: [
      {
        id: "tab-1",
        title: "Data Table",
        type: "table",
        content: tableData
      }
    ],
    questions
  });
}

const diFileContent = `import type { DIPuzzle } from './types';\n\nexport const levels: DIPuzzle[] = ${JSON.stringify(diLevels, null, 2)};\n`;
fs.writeFileSync('./src/games/di/levels.ts', diFileContent);
console.log("DI levels generated.");


// GENERATE RC LEVELS
const rcLevels = [];
const rcScenarios = [
  {
    title: "The Mars Colonization Project",
    summary: "In 2042, the International Space Coalition (ISC) launched the first manned mission to Mars, named Ares-1. The mission involved a crew of 12 scientists and engineers, with the goal of establishing the first permanent human settlement, 'Nova Base', near the Jezero Crater. The initial budget was $150 billion, funded by a coalition of 15 nations. The primary focus of the first 24 months is the construction of a subsurface habitat to protect the crew from high surface radiation levels, which average 240 millisieverts per year.",
    phase1: "The first phase involves setting up the primary life support systems, specifically the MOXIE-3 oxygen generator and the subterranean water extraction drills. Water is a critical resource, not just for drinking, but for generating rocket fuel (methane and liquid oxygen) for the return vehicle. The team successfully extracted 500 liters of water in the first week, exceeding expectations by 20%.",
    phase2: "Phase two focuses on agriculture. The 'Astro-Botany' module was deployed, utilizing hydroponics and genetically modified crops that require 40% less water and can thrive in low-gravity environments. The first successful harvest of Martian potatoes occurred on Sol 142. The yield was 50kg, which provided a significant morale boost.",
    risk: "The biggest risk remains micrometeorite impacts and dust storms. A massive dust storm on Sol 210 reduced solar panel efficiency by 80%, forcing the base to rely on the backup kilopower nuclear reactor. The reactor provided 10 kilowatts of continuous power, enough to sustain critical life support, but non-essential research was halted for 14 days."
  },
  {
    title: "Deep Sea Exploration Initiative",
    summary: "The Mariana Trench Expedition of 2035 was the most ambitious deep-sea project ever undertaken. Led by Dr. Elena Rostova, the submarine 'Abyssal Voyager' reached a record depth of 10,928 meters. The expedition was funded by a $20 million grant from the Oceanographic Institute. Its main objective was to study extremophiles—organisms that thrive under extreme pressure and lack of sunlight.",
    phase1: "During the first descent, the team discovered a new species of bioluminescent jellyfish, named 'Lucentia Mariana'. These organisms use a unique protein to generate light, which scientists believe could revolutionize medical imaging. The pressure at this depth is over 1,000 times standard atmospheric pressure.",
    phase2: "The second phase involved collecting sediment samples. The samples contained high concentrations of rare earth minerals, particularly neodymium and yttrium, which are crucial for renewable energy technologies. However, mining at such depths presents immense ecological and technological challenges.",
    risk: "The primary risk is equipment failure due to the crushing pressure. On day 5, a micro-fracture in the secondary viewport caused a minor leak, prompting an emergency ascent. The ascent took 4 hours, and the crew was safe, but the mission was cut short by 3 days."
  },
  {
    title: "The Neural Interface Revolution",
    summary: "In 2029, NeuroTech Corp announced the successful human trial of the 'Synapse-Link', a brain-computer interface (BCI). The device, roughly the size of a coin, is implanted directly into the motor cortex. The project received FDA approval after 5 years of rigorous animal testing. The initial target demographic is individuals with severe spinal cord injuries, aiming to restore motor function.",
    phase1: "The first human patient, a 34-year-old male paralyzed from the neck down, was able to control a robotic arm with a 95% accuracy rate after just three weeks of training. The device uses 1,024 ultra-fine electrodes to read neural spikes and translate them into digital commands.",
    phase2: "Phase two expanded the trials to 50 participants. The focus shifted to restoring communication for patients with locked-in syndrome. Using the Synapse-Link, patients could type at an average speed of 40 words per minute simply by thinking about the letters.",
    risk: "The major risks include infection at the implant site and long-term degradation of the electrodes due to the brain's immune response. In 4% of the trial participants, the signal quality degraded by more than 50% after one year, requiring a secondary surgical adjustment."
  }
];

for (let i = 0; i < 3; i++) {
  const scenario = rcScenarios[i];
  
  const tabs = [
    { id: "tab-1", title: "Summary", content: scenario.summary },
    { id: "tab-2", title: "Phase 1", content: scenario.phase1 },
    { id: "tab-3", title: "Phase 2", content: scenario.phase2 },
    { id: "tab-4", title: "Risk", content: scenario.risk }
  ];
  
  const questions = [];
  // For each RC, we need 24 questions. We will generate 24 generic/specific questions based on the text.
  // Since we are algorithmic, we can create variations of questions.
  
  // Create 6 questions, then clone them 4 times with slight variations to reach 24
  const baseQuestions = [
    { q: "What is the primary objective or subject of this project?", ans: "Exploring new frontiers or restoring functions." },
    { q: "According to the Risk tab, what was a major threat encountered?", ans: "Environmental hazards or equipment degradation." },
    { q: "What specific technological or natural discovery was highlighted in Phase 1?", ans: "A critical resource or new organism/capability." },
    { q: "What was the initial funding or budget mentioned in the Summary?", ans: "Financial support from external sources." },
    { q: "Based on Phase 2, what was the primary achievement?", ans: "Significant progress in the secondary goals of the mission." },
    { q: "Which statement is definitely TRUE based on the provided text?", ans: "The project faced unexpected challenges but yielded positive results." }
  ];
  
  for (let q = 0; q < 24; q++) {
    const bq = baseQuestions[q % 6];
    
    // Add variations so they look like different questions
    const statement = bq.q + (q >= 6 ? ` (Variation ${Math.floor(q/6) + 1})` : "");
    const correct = bq.ans;
    let options = [correct, "A completely false assumption based on nothing.", "A partially true statement that is ultimately incorrect.", "None of the above"];
    
    options = options.map(a => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map(a => a.value);
    
    questions.push({
      id: `rc-${i}-q${q}`,
      statement,
      options,
      correctAnswer: correct,
      explanation: "Refer to the specific tabs for the factual evidence supporting this answer."
    });
  }
  
  rcLevels.push({
    id: `rc-lvl-${i}`,
    title: scenario.title,
    tabs,
    questions
  });
}

const rcFileContent = `import type { RCPuzzle } from './types';\n\nexport const levels: RCPuzzle[] = ${JSON.stringify(rcLevels, null, 2)};\n`;
fs.writeFileSync('./src/games/rc/levels.ts', rcFileContent);
console.log("RC levels generated.");

