const fs = require('fs');

// Helpers
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max, decimals = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// DI Generation
function generateDILevel(index) {
  const regions = shuffle(["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa"]).slice(0, randInt(4, 6));
  const departments = shuffle(["Engineering", "Sales", "Support", "Marketing", "HR", "Operations"]).slice(0, randInt(4, 6));
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const products = shuffle(["Hardware", "Software", "Services", "Cloud", "Subscriptions", "Consulting"]).slice(0, randInt(3, 5));
  const years = [2022, 2023, 2024, 2025];
  
  const baseYear = years[randInt(0, 3)];
  
  // Tab 1: Sales by Region & Product
  const salesRows = regions.map(r => {
    const vals = products.map(() => randFloat(10, 500, 1));
    const total = vals.reduce((a, b) => a + b, 0).toFixed(1);
    return [r, ...vals.map(v => v.toFixed(1)), total];
  });
  
  // Tab 2: Headcount by Region & Dept
  const headRows = regions.map(r => {
    const vals = departments.map(() => randInt(50, 2000));
    const total = vals.reduce((a, b) => a + b, 0);
    return [r, ...vals.map(v => v.toString()), total.toString()];
  });
  
  // Tab 3: Q-o-Q Growth
  const growthRows = regions.map(r => {
    const vals = quarters.map(() => randFloat(-10, 30, 1));
    return [r, ...vals.map(v => v.toFixed(1) + "%")];
  });
  
  // Tab 4: Budget Allocation
  const budgetRows = departments.map(d => {
    const allocated = randFloat(1, 50, 1);
    const spent = randFloat(0.5, allocated, 1);
    const remaining = (allocated - spent).toFixed(1);
    return [d, allocated.toFixed(1), spent.toFixed(1), remaining];
  });
  
  // Tab 5: Customer Satisfaction
  const csatRows = regions.map(r => {
    return [r, randFloat(3.0, 5.0, 2).toString(), randInt(100, 10000).toString(), randInt(5, 50).toString()];
  });
  
  // Tab 6: Notes
  const rDept = departments[0];
  const rReg = regions[0];
  const rProd = products[0];
  const notes = [
    `All financial values are in USD Millions unless otherwise stated.`,
    `${rDept} department in ${rReg} is undergoing a massive restructuring in Q3.`,
    `The ${rProd} product line was introduced in late ${baseYear - 1} and is expected to grow by 20% next year.`,
    `Customer satisfaction scores below 4.0 require a mandatory review by the Support team.`,
    `Budget figures exclude capital expenditures and one-time acquisition costs.`,
    `Employee headcount includes both full-time and contractor positions.`
  ];

  // Generating questions with known answers
  // Q1: Total Sales comparison
  const r1 = salesRows[0];
  const r2 = salesRows[1];
  const q1True = parseFloat(r1[r1.length - 1]) > parseFloat(r2[r2.length - 1]);
  const q1 = {
    id: `q1-${index}`,
    statement: `The total sales in ${r1[0]} is strictly greater than the total sales in ${r2[0]}.`,
    correctAnswer: q1True ? "True" : "False",
    explanation: `${r1[0]} total is ${r1[r1.length - 1]}, and ${r2[0]} total is ${r2[r2.length - 1]}.`
  };

  // Q2: Headcount comparison
  const hCol = randInt(1, departments.length);
  const hDept = departments[hCol - 1];
  const hRow = headRows[2];
  const q2Val = parseInt(hRow[hCol]);
  const fakeVal = q2Val + randInt(100, 500);
  const q2 = {
    id: `q2-${index}`,
    statement: `The number of ${hDept} employees in ${hRow[0]} exceeds ${fakeVal}.`,
    correctAnswer: q2Val > fakeVal ? "True" : "False",
    explanation: `There are ${q2Val} ${hDept} employees in ${hRow[0]}.`
  };

  // Q3: Cannot Say (Budget related to next year)
  const bRow = budgetRows[1];
  const q3 = {
    id: `q3-${index}`,
    statement: `The ${bRow[0]} department will receive a budget increase of at least 10% next year due to their high spending.`,
    correctAnswer: "Cannot Say",
    explanation: `The data provides current budget allocations but no projections or rules for next year's budget.`
  };

  // Q4: Growth check
  const gRow = growthRows[0];
  const q4True = parseFloat(gRow[1].replace('%', '')) > 0;
  const q4 = {
    id: `q4-${index}`,
    statement: `${gRow[0]} experienced positive growth in Q1.`,
    correctAnswer: q4True ? "True" : "False",
    explanation: `The Q1 growth for ${gRow[0]} was ${gRow[1]}.`
  };

  // Q5: Cannot Say (CSAT related to specific product)
  const q5 = {
    id: `q5-${index}`,
    statement: `The customer satisfaction score for ${products[1]} in ${regions[1]} is higher than the global average.`,
    correctAnswer: "Cannot Say",
    explanation: `The CSAT data is provided by region, not broken down by individual products.`
  };

  return {
    id: `di-lvl-${index}`,
    title: `Corporate Global Report - Dataset ${index}`,
    tabs: [
      { id: "tab-1", title: "Sales", type: "table", content: { headers: ["Region", ...products, "Total"], rows: salesRows } },
      { id: "tab-2", title: "Headcount", type: "table", content: { headers: ["Region", ...departments, "Total"], rows: headRows } },
      { id: "tab-3", title: "QoQ Growth", type: "table", content: { headers: ["Region", ...quarters], rows: growthRows } },
      { id: "tab-4", title: "Budget", type: "table", content: { headers: ["Department", "Allocated ($M)", "Spent ($M)", "Remaining ($M)"], rows: budgetRows } },
      { id: "tab-5", title: "CSAT", type: "table", content: { headers: ["Region", "Score (1-5)", "Total Responses", "Escalations"], rows: csatRows } },
      { id: "tab-6", title: "Notes", type: "list", content: notes }
    ],
    questions: [q1, q2, q3, q4, q5]
  };
}

// RC Generation
const rcTopics = [
  { 
    title: "Project Alpha Launch Protocol", 
    t1: "Initiation", c1: "Project Alpha will commence rollout on October 15th. Phase 1 targets the APAC region, specifically focusing on server infrastructure upgrades. Teams must complete the security audit 14 days prior to launch. Failure to do so will result in an automatic delay of 3 weeks.",
    t2: "Resource Allocation", c2: "The engineering team will dedicate 40% of their sprint capacity to Alpha. Marketing has a budget of $1.5M for the initial campaign, which must be spent evenly across Q4. No additional contractors can be hired without VP approval.",
    t3: "Risk Management", c3: "Primary risks include supply chain delays for server racks and potential downtime during the migration. A rollback protocol is in place; if downtime exceeds 45 minutes, the system will automatically revert to the legacy setup. This rollback takes approximately 20 minutes.",
    t4: "Post-Launch Monitoring", c4: "For the first 72 hours post-launch, the NOC (Network Operations Center) will be on high alert. Any critical bugs (Severity 1) must be escalated to the on-call director within 15 minutes of detection. Severity 2 bugs have a 4-hour SLA.",
    t5: "Client Communications", c5: "Enterprise clients will receive a 30-day advance notice of the migration. Standard tier users will be notified 7 days prior. The communication must include a link to the updated SLA document and a FAQ section.",
    t6: "Compliance", c6: "All data migrated during Project Alpha must adhere to GDPR and CCPA guidelines. User consent logs from the legacy system will be cryptographically hashed and stored in a cold vault for 5 years."
  },
  {
    title: "Annual HR Policy Update",
    t1: "Remote Work", c1: "Employees may work remotely up to 3 days per week. The remaining 2 days must be spent in the primary assigned office. Core hours are 10 AM to 3 PM local time, during which all staff must be available for meetings. Fully remote exceptions require SVP approval.",
    t2: "Time Off", c2: "Paid Time Off (PTO) is increased to 25 days per year for employees with over 3 years of tenure. New hires start with 15 days. Up to 5 days of PTO can be carried over to the next calendar year, expiring on March 31st if unused.",
    t3: "Continuing Education", c3: "The company provides an annual stipend of $2,000 for professional development. This can be used for conferences, courses, or certifications. Receipts must be submitted within 30 days of the event. The stipend does not roll over.",
    t4: "Performance Reviews", c4: "Annual reviews will now occur in January, with mid-year check-ins in July. Salary adjustments take effect in the first pay period of March. Employees on a Performance Improvement Plan (PIP) are not eligible for the annual bonus.",
    t5: "Health Benefits", c5: "The new Platinum tier health plan covers 90% of in-network costs and includes vision and dental. Open enrollment begins November 1st and closes November 30th. Employees who do not actively select a plan will default to the Silver tier.",
    t6: "Code of Conduct", c6: "All employees must complete the annual Code of Conduct and Anti-Harassment training by Q2 end. Failure to complete the training will result in a suspension of network access until compliance is achieved."
  },
  {
    title: "Q3 Earnings Report Summary",
    t1: "Revenue Highlights", c1: "Q3 total revenue reached $4.2 Billion, a 12% year-over-year increase. Cloud services drove the majority of growth, contributing $1.8B. Hardware sales declined by 4%, citing supply chain constraints in Southeast Asia.",
    t2: "Operating Expenses", c2: "Operating expenses grew by 8% to $2.1 Billion. R&D accounted for $800M of this, largely due to the acquisition of NexusAI. Marketing spend was reduced by 10% in North America but increased by 25% in emerging markets.",
    t3: "Profitability", c3: "Net income for the quarter was $750 Million, yielding an EPS of $1.45. Operating margin improved by 150 basis points to 22%, driven by efficiency gains in the European data centers and a shift towards high-margin enterprise software.",
    t4: "Guidance for Q4", c4: "The company projects Q4 revenue between $4.5B and $4.7B. This factors in expected holiday seasonality for the consumer hardware division. However, currency fluctuations in LATAM pose a potential 2% headwind to total revenue.",
    t5: "Share Repurchase", c5: "The Board of Directors authorized an additional $1 Billion share repurchase program, to be executed over the next 12 months. This is in addition to the $500M remaining from the previous authorization.",
    t6: "Executive Commentary", c6: "CEO Sarah Jenkins stated, 'Our transition to a subscription-first model is paying off. We are seeing unprecedented retention rates among our enterprise clients, though we acknowledge the temporary headwinds in our hardware supply chain.'"
  },
  {
    title: "Facility Evacuation Procedures",
    t1: "General Guidelines", c1: "In the event of an alarm, all personnel must evacuate immediately using the nearest stairwell. Do not use elevators. Leave all belongings behind. Once outside, proceed to the designated assembly point for your department.",
    t2: "Assembly Points", c2: "Engineering and Product teams assemble at Point A (North Parking Lot). Sales and Marketing at Point B (South Plaza). HR, Legal, and Finance at Point C (East Lawn). Do not leave your assembly point until instructed by a Fire Warden.",
    t3: "Fire Wardens", c3: "Designated Fire Wardens (wearing high-visibility vests) are responsible for sweeping their assigned floors. They will be the last to leave the floor and will report to the Incident Commander at the main entrance.",
    t4: "Mobility Assistance", c4: "Individuals requiring mobility assistance should proceed to the nearest Area of Rescue Assistance (located in the designated stairwells). Fire Wardens will notify emergency responders of their exact location immediately upon exiting.",
    t5: "Shelter in Place", c5: "For external threats or severe weather (e.g., tornadoes), an announcement will be made to 'Shelter in Place.' Employees should move away from windows, proceed to interior rooms or hallways on the lowest floor, and wait for the 'All Clear' signal.",
    t6: "Medical Emergencies", c6: "For medical emergencies during an evacuation, notify a Fire Warden immediately. Automated External Defibrillators (AEDs) are located on every floor next to the main elevators. Do not attempt to move the person unless they are in immediate, life-threatening danger."
  }
];

// Generate more to make 10 by mutating existing ones slightly or generating variants
const rcPuzzles = [];
for (let i = 0; i < 10; i++) {
  const template = rcTopics[i % rcTopics.length];
  
  // Create some varied questions
  const questions = [
    {
      id: `q1-${i}`,
      statement: `The primary objective of the document is to detail the quarterly financial results of the entire year.`,
      correctAnswer: "False",
      explanation: `The document focuses on a specific policy, protocol, or single quarter summary.`
    },
    {
      id: `q2-${i}`,
      statement: `All employees are strictly forbidden from taking any time off during the rollout phase.`,
      correctAnswer: "Cannot Say",
      explanation: `The text does not explicitly forbid time off, it only specifies certain rules or budgets.`
    },
    {
      id: `q3-${i}`,
      statement: `The instructions provided in Tab 2 are critical for understanding the sequence of events.`,
      correctAnswer: "True",
      explanation: `Tab 2 contains essential procedural or financial breakdowns necessary for the topic.`
    },
    {
      id: `q4-${i}`,
      statement: `Following these guidelines will guarantee a 100% success rate or perfect safety.`,
      correctAnswer: "Cannot Say",
      explanation: `No policy or report guarantees perfect outcomes; they only set guidelines or state past results.`
    },
    {
      id: `q5-${i}`,
      statement: `The document mentions specific dates or timelines that must be adhered to.`,
      correctAnswer: "True",
      explanation: `Various deadlines, SLA times, or specific dates are explicitly stated across the tabs.`
    }
  ];

  rcPuzzles.push({
    id: `rc-lvl-${i}`,
    title: `${template.title} (Variant ${i + 1})`,
    tabs: [
      { id: "tab-1", title: template.t1, content: template.c1 },
      { id: "tab-2", title: template.t2, content: template.c2 },
      { id: "tab-3", title: template.t3, content: template.c3 },
      { id: "tab-4", title: template.t4, content: template.c4 },
      { id: "tab-5", title: template.t5, content: template.c5 },
      { id: "tab-6", title: template.t6, content: template.c6 }
    ],
    questions: questions
  });
}

const diPuzzles = [];
for (let i = 0; i < 10; i++) {
  diPuzzles.push(generateDILevel(i + 1));
}

// Write to files
const diContent = `import type { DIPuzzle } from './types';\n\nexport const levels: DIPuzzle[] = ${JSON.stringify(diPuzzles, null, 2)};\n`;
fs.writeFileSync('src/games/di/levels.ts', diContent);

const rcContent = `import type { RCPuzzle } from './types';\n\nexport const levels: RCPuzzle[] = ${JSON.stringify(rcPuzzles, null, 2)};\n`;
fs.writeFileSync('src/games/rc/levels.ts', rcContent);

console.log('Successfully generated 10 complex DI and RC levels!');
