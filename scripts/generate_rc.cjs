const fs = require('fs');

const rcTopics = [
  { 
    title: "Global Supply Chain Resilience Initiative", 
    t1: "Executive Summary", c1: "In response to the unprecedented disruptions of the past three years, the Executive Board has formally ratified the Global Supply Chain Resilience Initiative (GSCRI). The primary mandate of this initiative is to transition our sourcing model from a cost-optimized, single-source dependency structure to a highly resilient, diversified multi-node network. Historically, our reliance on the Southeast Asian manufacturing hub yielded a 15% cost advantage over competitors, but recent geopolitical tensions and logistical bottlenecks resulted in a $45 million revenue shortfall in Q2 alone. The GSCRI will be rolled out in three distinct phases over the next 36 months, requiring an initial capital expenditure of $120 million. The ultimate goal is to ensure that no single geographic region accounts for more than 40% of our total component sourcing, thereby mitigating systemic risk while attempting to cap the resulting cost-of-goods-sold (COGS) increase at a maximum of 4%.",
    t2: "Phase 1: Nearshoring", c2: "Phase 1 focuses on aggressive nearshoring of critical semiconductor components. Currently, 85% of our microprocessors are fabricated in Taiwan. By Q4 of the current fiscal year, we aim to establish parallel supply agreements with two new fabrication facilities located in Arizona and Texas. This transition is not without significant challenges; the domestic facilities charge a premium of 18% per unit. To offset this, the procurement team has negotiated long-term, 5-year volume commitments that include a rebate structure if we exceed 2 million units annually. Furthermore, the logistical lead time will decrease dramatically from 22 days via ocean freight to just 4 days via domestic rail. This reduction in transit time allows us to transition from a 'just-in-case' inventory model—which currently ties up $80 million in working capital—back to a leaner 'just-in-time' methodology.",
    t3: "Phase 2: Redundancy", c3: "Phase 2, scheduled to commence in Month 13, addresses the secondary tier of our bill of materials, specifically rare earth magnets and specialized alloys. We are partnering with a consortium of European suppliers to build a strategic reserve buffer. This buffer will hold exactly 90 days' worth of inventory for our top 20 most critical components. The storage of these materials will be localized in a newly leased, climate-controlled warehouse facility in Frankfurt, Germany. The annual lease and maintenance costs for this facility are projected at $3.2 million. However, actuarial models suggest that avoiding a single 14-day production halt will save the company $12 million, justifying the storage expense. Additionally, a new proprietary AI-driven forecasting tool, codenamed 'Oracle-SC', will be deployed to monitor global risk indices and automatically trigger purchase orders when localized disruptions are predicted with over 75% confidence.",
    t4: "Phase 3: Circular Economy", c4: "The final phase of the GSCRI integrates sustainability into our supply chain through a Circular Economy model. We are launching a global product take-back program, incentivizing enterprise clients to return end-of-life hardware for a 15% credit toward future purchases. Our engineering team has redesigned the chassis of our flagship enterprise server to allow for 80% component recyclability. We estimate that by year three, up to 25% of the raw aluminum and copper used in new manufacturing will be sourced directly from our own recycling centers in Mexico and Poland. This not only insulates us from commodity price volatility in the metals market but also aligns with our corporate pledge to reduce Scope 3 carbon emissions by 30% by 2030. The pilot program for the take-back initiative will begin exclusively with our Fortune 500 clients in North America.",
    t5: "Risk Mitigation", c5: "While the GSCRI significantly enhances our operational robustness, it introduces new vectors of risk. The fragmentation of our supplier base from 40 primary vendors to over 150 increases the complexity of quality assurance. The QA department will expand its headcount by 45 personnel, deploying 'boots-on-the-ground' inspectors to the new nearshore and European facilities. A strict 'three-strike' policy will be implemented for all new vendors: any supplier that delivers three shipments containing a defect rate higher than 0.5% within a rolling 12-month period will be immediately disqualified. To manage the massive influx of compliance documentation, the company is adopting a blockchain-based ledger system. This immutable ledger will track the provenance of every component from raw material extraction to final assembly, ensuring compliance with international labor laws and environmental regulations.",
    t6: "Financial Projections", c6: "The financial restructuring required for the GSCRI is extensive. The $120 million capital expenditure will be funded through a combination of existing cash reserves ($50M) and a newly issued corporate green bond ($70M) at a 4.2% interest rate. The shift to multi-node sourcing will inherently raise our COGS by an estimated 3.8%. To protect our gross margins, the pricing strategy committee has approved a staggered 5% price increase on all enterprise hardware, to be implemented over the next two product cycles. We anticipate a temporary dip in operating margin from 22% to 19% during the transition year, rebounding to 23% by Year 3 as the efficiency of nearshoring and the cost savings from the circular economy model begin to materialize. Investors have been briefed, and market reaction has been largely positive, prioritizing long-term stability over short-term margin compression."
  }
];

const generateQuestions = (i) => [
  {
    id: `q1-${i}`,
    statement: `What was the primary financial catalyst that prompted the ratification of the GSCRI?`,
    options: [
      "A 15% cost advantage over competitors.",
      "A $45 million revenue shortfall in a single quarter.",
      "The need to spend $120 million in capital expenditures.",
      "A desire to decrease the cost-of-goods-sold by 4%."
    ],
    correctAnswer: "A $45 million revenue shortfall in a single quarter.",
    explanation: "The Executive Summary states that 'recent geopolitical tensions and logistical bottlenecks resulted in a $45 million revenue shortfall in Q2 alone', which drove the need for the initiative."
  },
  {
    id: `q2-${i}`,
    statement: `How does the company plan to offset the 18% premium charged by domestic semiconductor facilities in Phase 1?`,
    options: [
      "By charging customers an 18% premium on final products.",
      "By entirely eliminating ocean freight costs.",
      "By negotiating long-term volume commitments with rebate structures.",
      "By moving to a 'just-in-case' inventory methodology."
    ],
    correctAnswer: "By negotiating long-term volume commitments with rebate structures.",
    explanation: "Phase 1 explicitly mentions: 'the procurement team has negotiated long-term, 5-year volume commitments that include a rebate structure if we exceed 2 million units annually' to offset the premium."
  },
  {
    id: `q3-${i}`,
    statement: `Based on the text, what is the primary financial justification for leasing the $3.2 million climate-controlled warehouse in Frankfurt?`,
    options: [
      "It allows the company to store rare earth magnets indefinitely.",
      "Avoiding a single 14-day production halt will save the company $12 million.",
      "It is required by the European supplier consortium.",
      "It houses the servers for the new Oracle-SC AI forecasting tool."
    ],
    correctAnswer: "Avoiding a single 14-day production halt will save the company $12 million.",
    explanation: "Phase 2 states: 'actuarial models suggest that avoiding a single 14-day production halt will save the company $12 million, justifying the storage expense.'"
  },
  {
    id: `q4-${i}`,
    statement: `Under the new Risk Mitigation protocols, what specific condition will result in a supplier's immediate disqualification?`,
    options: [
      "Failing to use the blockchain-based ledger system.",
      "A single shipment with a defect rate exceeding 0.5%.",
      "Three shipments with a defect rate higher than 0.5% within a 12-month period.",
      "Refusing to allow boots-on-the-ground inspectors into their facilities."
    ],
    correctAnswer: "Three shipments with a defect rate higher than 0.5% within a 12-month period.",
    explanation: "The Risk Mitigation tab outlines a 'three-strike' policy where three shipments with a >0.5% defect rate within a rolling 12-month period leads to disqualification."
  },
  {
    id: `q5-${i}`,
    statement: `How does the company intend to fund the $120 million capital expenditure required for the GSCRI?`,
    options: [
      "Entirely through a newly issued corporate green bond.",
      "By implementing a 5% price increase on all enterprise hardware.",
      "Through $80 million in freed-up working capital and $40 million in cash.",
      "Using $50M from cash reserves and $70M from a corporate green bond."
    ],
    correctAnswer: "Using $50M from cash reserves and $70M from a corporate green bond.",
    explanation: "The Financial Projections tab states the CapEx will be funded through 'existing cash reserves ($50M) and a newly issued corporate green bond ($70M)'."
  }
];

const rcPuzzles = [];
for (let i = 0; i < 10; i++) {
  const template = rcTopics[0]; // Using a highly detailed generic corporate template for all to simulate the test length
  
  rcPuzzles.push({
    id: `rc-lvl-${i}`,
    title: `${template.title} (Module ${i + 1})`,
    tabs: [
      { id: "tab-1", title: "Summary", content: template.c1 },
      { id: "tab-2", title: "Phase 1", content: template.c2 },
      { id: "tab-3", title: "Phase 2", content: template.c3 },
      { id: "tab-4", title: "Phase 3", content: template.c4 },
      { id: "tab-5", title: "Risk", content: template.c5 },
      { id: "tab-6", title: "Financials", content: template.c6 }
    ],
    questions: generateQuestions(i) // All have complex factual questions now
  });
}

const rcContent = `import type { RCPuzzle } from './types';\n\nexport const levels: RCPuzzle[] = ${JSON.stringify(rcPuzzles, null, 2)};\n`;
fs.writeFileSync('src/games/rc/levels.ts', rcContent);

console.log('Successfully generated complex RC levels with long paragraphs and factual questions!');
