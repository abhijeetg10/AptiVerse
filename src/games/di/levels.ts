import type { DIPuzzle } from './types';

export const levels: DIPuzzle[] = [
  {
    "id": "di-lvl-0",
    "title": "Annual Corporate Financial Performance (2020-2024)",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Data Table",
        "type": "table",
        "content": [
          [
            "Category",
            "2020",
            "2021",
            "2022",
            "2023",
            "2024"
          ],
          [
            "North America",
            "906",
            "377",
            "201",
            "536",
            "126"
          ],
          [
            "Europe",
            "528",
            "475",
            "210",
            "849",
            "291"
          ],
          [
            "Asia",
            "781",
            "784",
            "253",
            "992",
            "614"
          ],
          [
            "South America",
            "457",
            "439",
            "655",
            "149",
            "401"
          ]
        ]
      }
    ],
    "questions": [
      {
        "id": "di-0-q0",
        "statement": "What was the Revenue (in $ Millions) for North America in 2024?",
        "options": [
          "136",
          "126",
          "173",
          "111"
        ],
        "correctAnswer": "126",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q1",
        "statement": "The Revenue (in $ Millions) for South America in 2023 was greater than North America in 2022.",
        "options": [
          "False",
          "True",
          "Cannot Say"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q2",
        "statement": "What is the total Revenue (in $ Millions) for South America across all periods/categories?",
        "options": [
          "2051",
          "2101",
          "2121",
          "2201"
        ],
        "correctAnswer": "2101",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q3",
        "statement": "What was the Revenue (in $ Millions) for North America in 2022?",
        "options": [
          "211",
          "186",
          "201",
          "956"
        ],
        "correctAnswer": "201",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q4",
        "statement": "What is the total Revenue (in $ Millions) for Asia across all periods/categories?",
        "options": [
          "3444",
          "3424",
          "3524",
          "3374"
        ],
        "correctAnswer": "3424",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q5",
        "statement": "What was the Revenue (in $ Millions) for South America in 2020?",
        "options": [
          "944",
          "457",
          "442",
          "467"
        ],
        "correctAnswer": "457",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q6",
        "statement": "What is the total Revenue (in $ Millions) for South America across all periods/categories?",
        "options": [
          "2051",
          "2201",
          "2101",
          "2121"
        ],
        "correctAnswer": "2101",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q7",
        "statement": "What is the difference in Revenue (in $ Millions) between 2021 and 2024 for South America? (Absolute value)",
        "options": [
          "53",
          "43",
          "28",
          "38"
        ],
        "correctAnswer": "38",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q8",
        "statement": "What was the Revenue (in $ Millions) for Europe in 2021?",
        "options": [
          "485",
          "475",
          "298",
          "460"
        ],
        "correctAnswer": "475",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q9",
        "statement": "The Revenue (in $ Millions) for South America in 2021 was greater than Europe in 2020.",
        "options": [
          "Cannot Say",
          "False",
          "True"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q10",
        "statement": "What is the total Revenue (in $ Millions) for Asia across all periods/categories?",
        "options": [
          "3524",
          "3374",
          "3444",
          "3424"
        ],
        "correctAnswer": "3424",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q11",
        "statement": "What was the Revenue (in $ Millions) for Asia in 2022?",
        "options": [
          "238",
          "253",
          "738",
          "263"
        ],
        "correctAnswer": "253",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q12",
        "statement": "What is the total Revenue (in $ Millions) for Europe across all periods/categories?",
        "options": [
          "2303",
          "2353",
          "2453",
          "2373"
        ],
        "correctAnswer": "2353",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q13",
        "statement": "What was the Revenue (in $ Millions) for Asia in 2020?",
        "options": [
          "695",
          "781",
          "791",
          "766"
        ],
        "correctAnswer": "781",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q14",
        "statement": "What is the total Revenue (in $ Millions) for Asia across all periods/categories?",
        "options": [
          "3524",
          "3424",
          "3444",
          "3374"
        ],
        "correctAnswer": "3424",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q15",
        "statement": "The Revenue (in $ Millions) for Europe in 2022 was greater than Europe in 2021.",
        "options": [
          "False",
          "Cannot Say",
          "True"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q16",
        "statement": "What is the total Revenue (in $ Millions) for South America across all periods/categories?",
        "options": [
          "2101",
          "2121",
          "2201",
          "2051"
        ],
        "correctAnswer": "2101",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q17",
        "statement": "The Revenue (in $ Millions) for North America in 2021 was greater than Europe in 2024.",
        "options": [
          "Cannot Say",
          "True",
          "False"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q18",
        "statement": "What was the Revenue (in $ Millions) for Asia in 2022?",
        "options": [
          "253",
          "238",
          "456",
          "263"
        ],
        "correctAnswer": "253",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q19",
        "statement": "The Revenue (in $ Millions) for North America in 2024 was greater than North America in 2021.",
        "options": [
          "Cannot Say",
          "True",
          "False"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q20",
        "statement": "The Revenue (in $ Millions) for Asia in 2022 was greater than South America in 2022.",
        "options": [
          "False",
          "Cannot Say",
          "True"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q21",
        "statement": "What is the difference in Revenue (in $ Millions) between 2023 and 2023 for South America? (Absolute value)",
        "options": [
          "15",
          "0",
          "-10",
          "5"
        ],
        "correctAnswer": "0",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q22",
        "statement": "What is the total Revenue (in $ Millions) for North America across all periods/categories?",
        "options": [
          "2246",
          "2146",
          "2166",
          "2096"
        ],
        "correctAnswer": "2146",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-0-q23",
        "statement": "What is the difference in Revenue (in $ Millions) between 2022 and 2023 for North America? (Absolute value)",
        "options": [
          "335",
          "350",
          "340",
          "325"
        ],
        "correctAnswer": "335",
        "explanation": "Calculated based on the data table."
      }
    ]
  },
  {
    "id": "di-lvl-1",
    "title": "Global Energy Consumption by Sector",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Data Table",
        "type": "table",
        "content": [
          [
            "Category",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          [
            "Industrial",
            "805",
            "447",
            "134",
            "862"
          ],
          [
            "Transportation",
            "786",
            "203",
            "844",
            "138"
          ],
          [
            "Residential",
            "344",
            "723",
            "801",
            "534"
          ],
          [
            "Commercial",
            "895",
            "147",
            "377",
            "171"
          ]
        ]
      }
    ],
    "questions": [
      {
        "id": "di-1-q0",
        "statement": "The Consumption (Exajoules) for Industrial in Q4 was greater than Industrial in Q1.",
        "options": [
          "Cannot Say",
          "False",
          "True"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q1",
        "statement": "What is the total Consumption (Exajoules) for Commercial across all periods/categories?",
        "options": [
          "1590",
          "1610",
          "1690",
          "1540"
        ],
        "correctAnswer": "1590",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q2",
        "statement": "What is the difference in Consumption (Exajoules) between Q3 and Q1 for Commercial? (Absolute value)",
        "options": [
          "523",
          "533",
          "518",
          "508"
        ],
        "correctAnswer": "518",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q3",
        "statement": "What was the Consumption (Exajoules) for Commercial in Q1?",
        "options": [
          "905",
          "895",
          "920",
          "880"
        ],
        "correctAnswer": "895",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q4",
        "statement": "The Consumption (Exajoules) for Transportation in Q3 was greater than Commercial in Q3.",
        "options": [
          "False",
          "True",
          "Cannot Say"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q5",
        "statement": "What is the total Consumption (Exajoules) for Industrial across all periods/categories?",
        "options": [
          "2248",
          "2268",
          "2348",
          "2198"
        ],
        "correctAnswer": "2248",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q6",
        "statement": "The Consumption (Exajoules) for Commercial in Q4 was greater than Transportation in Q2.",
        "options": [
          "Cannot Say",
          "True",
          "False"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q7",
        "statement": "The Consumption (Exajoules) for Residential in Q1 was greater than Residential in Q4.",
        "options": [
          "False",
          "Cannot Say",
          "True"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q8",
        "statement": "What is the difference in Consumption (Exajoules) between Q3 and Q3 for Transportation? (Absolute value)",
        "options": [
          "5",
          "-10",
          "15",
          "0"
        ],
        "correctAnswer": "0",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q9",
        "statement": "What is the total Consumption (Exajoules) for Industrial across all periods/categories?",
        "options": [
          "2248",
          "2268",
          "2198",
          "2348"
        ],
        "correctAnswer": "2248",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q10",
        "statement": "What is the difference in Consumption (Exajoules) between Q1 and Q2 for Residential? (Absolute value)",
        "options": [
          "384",
          "379",
          "394",
          "369"
        ],
        "correctAnswer": "379",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q11",
        "statement": "What was the Consumption (Exajoules) for Commercial in Q2?",
        "options": [
          "132",
          "147",
          "229",
          "157"
        ],
        "correctAnswer": "147",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q12",
        "statement": "What was the Consumption (Exajoules) for Residential in Q3?",
        "options": [
          "733",
          "811",
          "786",
          "801"
        ],
        "correctAnswer": "801",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q13",
        "statement": "The Consumption (Exajoules) for Transportation in Q3 was greater than Residential in Q3.",
        "options": [
          "Cannot Say",
          "False",
          "True"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q14",
        "statement": "The Consumption (Exajoules) for Transportation in Q3 was greater than Industrial in Q4.",
        "options": [
          "False",
          "True",
          "Cannot Say"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q15",
        "statement": "What is the total Consumption (Exajoules) for Residential across all periods/categories?",
        "options": [
          "2422",
          "2502",
          "2402",
          "2352"
        ],
        "correctAnswer": "2402",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q16",
        "statement": "What was the Consumption (Exajoules) for Transportation in Q3?",
        "options": [
          "144",
          "854",
          "829",
          "844"
        ],
        "correctAnswer": "844",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q17",
        "statement": "What was the Consumption (Exajoules) for Residential in Q3?",
        "options": [
          "801",
          "786",
          "811",
          "836"
        ],
        "correctAnswer": "801",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q18",
        "statement": "What is the total Consumption (Exajoules) for Residential across all periods/categories?",
        "options": [
          "2422",
          "2352",
          "2402",
          "2502"
        ],
        "correctAnswer": "2402",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q19",
        "statement": "What was the Consumption (Exajoules) for Industrial in Q4?",
        "options": [
          "922",
          "872",
          "862",
          "847"
        ],
        "correctAnswer": "862",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q20",
        "statement": "What is the total Consumption (Exajoules) for Commercial across all periods/categories?",
        "options": [
          "1540",
          "1610",
          "1590",
          "1690"
        ],
        "correctAnswer": "1590",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q21",
        "statement": "What was the Consumption (Exajoules) for Transportation in Q3?",
        "options": [
          "829",
          "854",
          "844",
          "644"
        ],
        "correctAnswer": "844",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q22",
        "statement": "What was the Consumption (Exajoules) for Commercial in Q1?",
        "options": [
          "386",
          "895",
          "905",
          "880"
        ],
        "correctAnswer": "895",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-1-q23",
        "statement": "What was the Consumption (Exajoules) for Commercial in Q1?",
        "options": [
          "905",
          "880",
          "759",
          "895"
        ],
        "correctAnswer": "895",
        "explanation": "Calculated based on the data table."
      }
    ]
  },
  {
    "id": "di-lvl-2",
    "title": "University Admissions Data",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Data Table",
        "type": "table",
        "content": [
          [
            "Category",
            "Engineering",
            "Medicine",
            "Arts",
            "Business"
          ],
          [
            "2021",
            "868",
            "196",
            "623",
            "301"
          ],
          [
            "2022",
            "286",
            "275",
            "777",
            "898"
          ],
          [
            "2023",
            "978",
            "343",
            "374",
            "379"
          ],
          [
            "2024",
            "258",
            "199",
            "789",
            "964"
          ]
        ]
      }
    ],
    "questions": [
      {
        "id": "di-2-q0",
        "statement": "The Applicants for 2023 in Arts was greater than 2023 in Business.",
        "options": [
          "True",
          "False",
          "Cannot Say"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q1",
        "statement": "The Applicants for 2021 in Business was greater than 2021 in Arts.",
        "options": [
          "Cannot Say",
          "True",
          "False"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q2",
        "statement": "What is the difference in Applicants between Arts and Arts for 2021? (Absolute value)",
        "options": [
          "-10",
          "0",
          "15",
          "5"
        ],
        "correctAnswer": "0",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q3",
        "statement": "What is the difference in Applicants between Arts and Engineering for 2021? (Absolute value)",
        "options": [
          "260",
          "235",
          "250",
          "245"
        ],
        "correctAnswer": "245",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q4",
        "statement": "What was the Applicants for 2024 in Engineering?",
        "options": [
          "268",
          "127",
          "258",
          "243"
        ],
        "correctAnswer": "258",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q5",
        "statement": "What was the Applicants for 2023 in Medicine?",
        "options": [
          "328",
          "343",
          "332",
          "353"
        ],
        "correctAnswer": "343",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q6",
        "statement": "What was the Applicants for 2021 in Engineering?",
        "options": [
          "853",
          "878",
          "514",
          "868"
        ],
        "correctAnswer": "868",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q7",
        "statement": "The Applicants for 2021 in Arts was greater than 2024 in Medicine.",
        "options": [
          "True",
          "Cannot Say",
          "False"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q8",
        "statement": "The Applicants for 2023 in Business was greater than 2022 in Engineering.",
        "options": [
          "True",
          "False",
          "Cannot Say"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q9",
        "statement": "What is the difference in Applicants between Medicine and Business for 2021? (Absolute value)",
        "options": [
          "105",
          "110",
          "95",
          "120"
        ],
        "correctAnswer": "105",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q10",
        "statement": "The Applicants for 2024 in Arts was greater than 2023 in Arts.",
        "options": [
          "False",
          "Cannot Say",
          "True"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q11",
        "statement": "What was the Applicants for 2021 in Engineering?",
        "options": [
          "878",
          "429",
          "853",
          "868"
        ],
        "correctAnswer": "868",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q12",
        "statement": "What is the difference in Applicants between Engineering and Arts for 2021? (Absolute value)",
        "options": [
          "235",
          "250",
          "245",
          "260"
        ],
        "correctAnswer": "245",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q13",
        "statement": "What was the Applicants for 2023 in Medicine?",
        "options": [
          "308",
          "353",
          "328",
          "343"
        ],
        "correctAnswer": "343",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q14",
        "statement": "What was the Applicants for 2023 in Business?",
        "options": [
          "995",
          "364",
          "379",
          "389"
        ],
        "correctAnswer": "379",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q15",
        "statement": "What is the total Applicants for 2023 across all periods/categories?",
        "options": [
          "2174",
          "2024",
          "2074",
          "2094"
        ],
        "correctAnswer": "2074",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q16",
        "statement": "The Applicants for 2022 in Medicine was greater than 2021 in Engineering.",
        "options": [
          "False",
          "Cannot Say",
          "True"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q17",
        "statement": "What is the difference in Applicants between Medicine and Business for 2022? (Absolute value)",
        "options": [
          "628",
          "613",
          "623",
          "638"
        ],
        "correctAnswer": "623",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q18",
        "statement": "What is the total Applicants for 2023 across all periods/categories?",
        "options": [
          "2024",
          "2094",
          "2074",
          "2174"
        ],
        "correctAnswer": "2074",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q19",
        "statement": "The Applicants for 2021 in Engineering was greater than 2023 in Business.",
        "options": [
          "Cannot Say",
          "False",
          "True"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q20",
        "statement": "What is the total Applicants for 2024 across all periods/categories?",
        "options": [
          "2230",
          "2310",
          "2160",
          "2210"
        ],
        "correctAnswer": "2210",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q21",
        "statement": "What is the difference in Applicants between Medicine and Arts for 2024? (Absolute value)",
        "options": [
          "580",
          "605",
          "590",
          "595"
        ],
        "correctAnswer": "590",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q22",
        "statement": "The Applicants for 2021 in Business was greater than 2023 in Business.",
        "options": [
          "False",
          "True",
          "Cannot Say"
        ],
        "correctAnswer": "False",
        "explanation": "Calculated based on the data table."
      },
      {
        "id": "di-2-q23",
        "statement": "The Applicants for 2024 in Arts was greater than 2023 in Business.",
        "options": [
          "Cannot Say",
          "True",
          "False"
        ],
        "correctAnswer": "True",
        "explanation": "Calculated based on the data table."
      }
    ]
  }
];
