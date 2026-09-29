import type { DIPuzzle } from './types';

export const levels: DIPuzzle[] = [
  {
    "id": "di-lvl-1",
    "title": "Corporate Global Report - Dataset 1",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Hardware",
            "Software",
            "Subscriptions",
            "Consulting",
            "Cloud",
            "Total"
          ],
          "rows": [
            [
              "Latin America",
              "378.1",
              "56.9",
              "417.2",
              "354.1",
              "78.1",
              "1284.4"
            ],
            [
              "North America",
              "116.3",
              "35.2",
              "23.4",
              "320.2",
              "391.8",
              "886.9"
            ],
            [
              "Europe",
              "276.2",
              "142.2",
              "207.7",
              "276.2",
              "51.7",
              "954.0"
            ],
            [
              "Asia Pacific",
              "65.6",
              "386.8",
              "286.4",
              "162.0",
              "484.9",
              "1385.7"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Sales",
            "Engineering",
            "Marketing",
            "Support",
            "Total"
          ],
          "rows": [
            [
              "Latin America",
              "1417",
              "208",
              "1842",
              "1464",
              "4931"
            ],
            [
              "North America",
              "492",
              "1438",
              "1467",
              "1324",
              "4721"
            ],
            [
              "Europe",
              "1591",
              "304",
              "1215",
              "197",
              "3307"
            ],
            [
              "Asia Pacific",
              "1570",
              "454",
              "1689",
              "721",
              "4434"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Latin America",
              "4.9%",
              "-5.5%",
              "29.5%",
              "-8.3%"
            ],
            [
              "North America",
              "24.6%",
              "10.3%",
              "24.9%",
              "15.1%"
            ],
            [
              "Europe",
              "-9.9%",
              "15.2%",
              "-9.7%",
              "20.0%"
            ],
            [
              "Asia Pacific",
              "21.5%",
              "19.8%",
              "28.8%",
              "-3.9%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Sales",
              "45.9",
              "33.9",
              "12.0"
            ],
            [
              "Engineering",
              "27.3",
              "15.3",
              "12.0"
            ],
            [
              "Marketing",
              "30.1",
              "25.6",
              "4.5"
            ],
            [
              "Support",
              "17.0",
              "4.7",
              "12.3"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Latin America",
              "3.63",
              "8170",
              "26"
            ],
            [
              "North America",
              "4.22",
              "6188",
              "46"
            ],
            [
              "Europe",
              "3.12",
              "6380",
              "43"
            ],
            [
              "Asia Pacific",
              "3.95",
              "2538",
              "14"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Sales department in Latin America is undergoing a massive restructuring in Q3.",
          "The Hardware product line was introduced in late 2024 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-1",
        "statement": "The total sales in Latin America is strictly greater than the total sales in North America.",
        "correctAnswer": "True",
        "explanation": "Latin America total is 1284.4, and North America total is 886.9."
      },
      {
        "id": "q2-1",
        "statement": "The number of Marketing employees in Europe exceeds 1575.",
        "correctAnswer": "False",
        "explanation": "There are 1215 Marketing employees in Europe."
      },
      {
        "id": "q3-1",
        "statement": "The Engineering department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-1",
        "statement": "Latin America experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for Latin America was 4.9%."
      },
      {
        "id": "q5-1",
        "statement": "The customer satisfaction score for Software in North America is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-2",
    "title": "Corporate Global Report - Dataset 2",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Software",
            "Services",
            "Subscriptions",
            "Consulting",
            "Cloud",
            "Total"
          ],
          "rows": [
            [
              "Asia Pacific",
              "467.0",
              "462.9",
              "140.8",
              "32.4",
              "275.1",
              "1378.2"
            ],
            [
              "Europe",
              "357.0",
              "498.8",
              "239.6",
              "376.7",
              "433.4",
              "1905.5"
            ],
            [
              "Africa",
              "361.6",
              "455.0",
              "469.3",
              "142.7",
              "129.6",
              "1558.2"
            ],
            [
              "Middle East",
              "240.6",
              "460.4",
              "320.1",
              "185.9",
              "80.9",
              "1287.9"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Engineering",
            "Sales",
            "Support",
            "Marketing",
            "Operations",
            "Total"
          ],
          "rows": [
            [
              "Asia Pacific",
              "179",
              "749",
              "1225",
              "1702",
              "1178",
              "5033"
            ],
            [
              "Europe",
              "955",
              "88",
              "1201",
              "1399",
              "610",
              "4253"
            ],
            [
              "Africa",
              "343",
              "422",
              "946",
              "180",
              "457",
              "2348"
            ],
            [
              "Middle East",
              "1025",
              "1827",
              "1055",
              "1249",
              "982",
              "6138"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Asia Pacific",
              "28.0%",
              "21.0%",
              "27.7%",
              "23.5%"
            ],
            [
              "Europe",
              "11.3%",
              "2.2%",
              "-5.7%",
              "-2.7%"
            ],
            [
              "Africa",
              "7.7%",
              "2.9%",
              "18.0%",
              "23.1%"
            ],
            [
              "Middle East",
              "-5.9%",
              "28.9%",
              "13.1%",
              "22.0%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Engineering",
              "28.6",
              "21.0",
              "7.6"
            ],
            [
              "Sales",
              "8.3",
              "0.8",
              "7.5"
            ],
            [
              "Support",
              "17.1",
              "1.1",
              "16.0"
            ],
            [
              "Marketing",
              "42.4",
              "38.8",
              "3.6"
            ],
            [
              "Operations",
              "15.5",
              "12.9",
              "2.6"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Asia Pacific",
              "3.79",
              "8836",
              "39"
            ],
            [
              "Europe",
              "3.4",
              "2986",
              "19"
            ],
            [
              "Africa",
              "3.37",
              "3284",
              "13"
            ],
            [
              "Middle East",
              "4.13",
              "6810",
              "25"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Engineering department in Asia Pacific is undergoing a massive restructuring in Q3.",
          "The Software product line was introduced in late 2023 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-2",
        "statement": "The total sales in Asia Pacific is strictly greater than the total sales in Europe.",
        "correctAnswer": "False",
        "explanation": "Asia Pacific total is 1378.2, and Europe total is 1905.5."
      },
      {
        "id": "q2-2",
        "statement": "The number of Marketing employees in Africa exceeds 642.",
        "correctAnswer": "False",
        "explanation": "There are 180 Marketing employees in Africa."
      },
      {
        "id": "q3-2",
        "statement": "The Sales department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-2",
        "statement": "Asia Pacific experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for Asia Pacific was 28.0%."
      },
      {
        "id": "q5-2",
        "statement": "The customer satisfaction score for Services in Europe is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-3",
    "title": "Corporate Global Report - Dataset 3",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Hardware",
            "Software",
            "Services",
            "Cloud",
            "Total"
          ],
          "rows": [
            [
              "North America",
              "151.1",
              "117.2",
              "306.5",
              "234.8",
              "809.6"
            ],
            [
              "Europe",
              "331.3",
              "20.7",
              "215.2",
              "391.9",
              "959.1"
            ],
            [
              "Asia Pacific",
              "337.1",
              "481.9",
              "259.0",
              "431.6",
              "1509.6"
            ],
            [
              "Latin America",
              "78.1",
              "447.3",
              "276.3",
              "436.4",
              "1238.1"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Engineering",
            "Marketing",
            "Operations",
            "Sales",
            "Total"
          ],
          "rows": [
            [
              "North America",
              "1685",
              "1611",
              "880",
              "1179",
              "5355"
            ],
            [
              "Europe",
              "964",
              "350",
              "397",
              "912",
              "2623"
            ],
            [
              "Asia Pacific",
              "844",
              "223",
              "1421",
              "1781",
              "4269"
            ],
            [
              "Latin America",
              "1808",
              "738",
              "1575",
              "137",
              "4258"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "North America",
              "-7.7%",
              "27.7%",
              "22.6%",
              "24.7%"
            ],
            [
              "Europe",
              "10.5%",
              "6.5%",
              "24.6%",
              "7.1%"
            ],
            [
              "Asia Pacific",
              "21.3%",
              "3.9%",
              "13.3%",
              "17.8%"
            ],
            [
              "Latin America",
              "8.3%",
              "4.1%",
              "0.9%",
              "3.8%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Engineering",
              "47.7",
              "47.3",
              "0.4"
            ],
            [
              "Marketing",
              "43.8",
              "16.3",
              "27.5"
            ],
            [
              "Operations",
              "5.9",
              "4.0",
              "1.9"
            ],
            [
              "Sales",
              "49.5",
              "11.3",
              "38.2"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "North America",
              "4.24",
              "7648",
              "24"
            ],
            [
              "Europe",
              "4.1",
              "2709",
              "35"
            ],
            [
              "Asia Pacific",
              "4.57",
              "1226",
              "14"
            ],
            [
              "Latin America",
              "4.59",
              "409",
              "42"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Engineering department in North America is undergoing a massive restructuring in Q3.",
          "The Hardware product line was introduced in late 2024 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-3",
        "statement": "The total sales in North America is strictly greater than the total sales in Europe.",
        "correctAnswer": "False",
        "explanation": "North America total is 809.6, and Europe total is 959.1."
      },
      {
        "id": "q2-3",
        "statement": "The number of Engineering employees in Asia Pacific exceeds 1188.",
        "correctAnswer": "False",
        "explanation": "There are 844 Engineering employees in Asia Pacific."
      },
      {
        "id": "q3-3",
        "statement": "The Marketing department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-3",
        "statement": "North America experienced positive growth in Q1.",
        "correctAnswer": "False",
        "explanation": "The Q1 growth for North America was -7.7%."
      },
      {
        "id": "q5-3",
        "statement": "The customer satisfaction score for Software in Europe is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-4",
    "title": "Corporate Global Report - Dataset 4",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Subscriptions",
            "Cloud",
            "Services",
            "Software",
            "Total"
          ],
          "rows": [
            [
              "Asia Pacific",
              "175.2",
              "430.3",
              "19.5",
              "231.2",
              "856.2"
            ],
            [
              "Middle East",
              "234.3",
              "145.8",
              "18.5",
              "160.7",
              "559.3"
            ],
            [
              "Europe",
              "374.1",
              "153.5",
              "147.3",
              "63.8",
              "738.7"
            ],
            [
              "Latin America",
              "140.8",
              "103.2",
              "153.9",
              "310.5",
              "708.4"
            ],
            [
              "Africa",
              "434.5",
              "176.9",
              "217.4",
              "378.5",
              "1207.3"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "HR",
            "Operations",
            "Engineering",
            "Sales",
            "Total"
          ],
          "rows": [
            [
              "Asia Pacific",
              "1215",
              "1524",
              "893",
              "435",
              "4067"
            ],
            [
              "Middle East",
              "574",
              "404",
              "1791",
              "1220",
              "3989"
            ],
            [
              "Europe",
              "267",
              "1227",
              "813",
              "1491",
              "3798"
            ],
            [
              "Latin America",
              "1422",
              "1846",
              "1011",
              "715",
              "4994"
            ],
            [
              "Africa",
              "907",
              "922",
              "1940",
              "1265",
              "5034"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Asia Pacific",
              "28.0%",
              "-8.3%",
              "7.1%",
              "-0.1%"
            ],
            [
              "Middle East",
              "-1.6%",
              "9.4%",
              "13.4%",
              "8.6%"
            ],
            [
              "Europe",
              "-1.1%",
              "-1.1%",
              "-1.3%",
              "-7.2%"
            ],
            [
              "Latin America",
              "-8.6%",
              "5.9%",
              "23.4%",
              "-0.1%"
            ],
            [
              "Africa",
              "6.1%",
              "-0.4%",
              "17.2%",
              "10.2%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "HR",
              "20.1",
              "3.0",
              "17.1"
            ],
            [
              "Operations",
              "40.6",
              "30.9",
              "9.7"
            ],
            [
              "Engineering",
              "38.4",
              "8.7",
              "29.7"
            ],
            [
              "Sales",
              "9.0",
              "8.2",
              "0.8"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Asia Pacific",
              "3.3",
              "760",
              "49"
            ],
            [
              "Middle East",
              "3.46",
              "1098",
              "21"
            ],
            [
              "Europe",
              "4.92",
              "7596",
              "34"
            ],
            [
              "Latin America",
              "3.3",
              "3359",
              "48"
            ],
            [
              "Africa",
              "4.6",
              "5247",
              "18"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "HR department in Asia Pacific is undergoing a massive restructuring in Q3.",
          "The Subscriptions product line was introduced in late 2024 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-4",
        "statement": "The total sales in Asia Pacific is strictly greater than the total sales in Middle East.",
        "correctAnswer": "True",
        "explanation": "Asia Pacific total is 856.2, and Middle East total is 559.3."
      },
      {
        "id": "q2-4",
        "statement": "The number of Sales employees in Europe exceeds 1844.",
        "correctAnswer": "False",
        "explanation": "There are 1491 Sales employees in Europe."
      },
      {
        "id": "q3-4",
        "statement": "The Operations department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-4",
        "statement": "Asia Pacific experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for Asia Pacific was 28.0%."
      },
      {
        "id": "q5-4",
        "statement": "The customer satisfaction score for Cloud in Middle East is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-5",
    "title": "Corporate Global Report - Dataset 5",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Software",
            "Hardware",
            "Subscriptions",
            "Services",
            "Total"
          ],
          "rows": [
            [
              "Africa",
              "41.6",
              "57.1",
              "263.3",
              "446.2",
              "808.2"
            ],
            [
              "North America",
              "305.5",
              "58.6",
              "300.3",
              "449.1",
              "1113.5"
            ],
            [
              "Europe",
              "41.2",
              "65.5",
              "468.2",
              "298.0",
              "872.9"
            ],
            [
              "Latin America",
              "310.0",
              "432.8",
              "182.1",
              "437.2",
              "1362.1"
            ],
            [
              "Middle East",
              "253.2",
              "271.7",
              "226.4",
              "25.9",
              "777.2"
            ],
            [
              "Asia Pacific",
              "122.6",
              "468.2",
              "354.8",
              "37.6",
              "983.2"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Support",
            "HR",
            "Operations",
            "Sales",
            "Total"
          ],
          "rows": [
            [
              "Africa",
              "149",
              "910",
              "1913",
              "581",
              "3553"
            ],
            [
              "North America",
              "389",
              "350",
              "1999",
              "1007",
              "3745"
            ],
            [
              "Europe",
              "1595",
              "436",
              "1909",
              "1920",
              "5860"
            ],
            [
              "Latin America",
              "1601",
              "946",
              "1228",
              "613",
              "4388"
            ],
            [
              "Middle East",
              "1565",
              "166",
              "1247",
              "1638",
              "4616"
            ],
            [
              "Asia Pacific",
              "237",
              "462",
              "437",
              "1276",
              "2412"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Africa",
              "12.4%",
              "16.2%",
              "15.2%",
              "24.5%"
            ],
            [
              "North America",
              "5.9%",
              "11.1%",
              "-2.0%",
              "23.9%"
            ],
            [
              "Europe",
              "14.9%",
              "15.1%",
              "21.2%",
              "26.7%"
            ],
            [
              "Latin America",
              "-2.9%",
              "18.8%",
              "19.9%",
              "15.5%"
            ],
            [
              "Middle East",
              "25.0%",
              "18.6%",
              "-9.9%",
              "-4.2%"
            ],
            [
              "Asia Pacific",
              "25.9%",
              "3.8%",
              "23.0%",
              "-6.1%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Support",
              "13.9",
              "4.4",
              "9.5"
            ],
            [
              "HR",
              "36.3",
              "15.7",
              "20.6"
            ],
            [
              "Operations",
              "18.8",
              "14.5",
              "4.3"
            ],
            [
              "Sales",
              "12.4",
              "11.1",
              "1.3"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Africa",
              "4.36",
              "3598",
              "7"
            ],
            [
              "North America",
              "4.73",
              "1172",
              "17"
            ],
            [
              "Europe",
              "3.65",
              "4628",
              "21"
            ],
            [
              "Latin America",
              "4.4",
              "7340",
              "12"
            ],
            [
              "Middle East",
              "3.94",
              "2509",
              "44"
            ],
            [
              "Asia Pacific",
              "3.63",
              "2061",
              "35"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Support department in Africa is undergoing a massive restructuring in Q3.",
          "The Software product line was introduced in late 2021 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-5",
        "statement": "The total sales in Africa is strictly greater than the total sales in North America.",
        "correctAnswer": "False",
        "explanation": "Africa total is 808.2, and North America total is 1113.5."
      },
      {
        "id": "q2-5",
        "statement": "The number of Sales employees in Europe exceeds 2168.",
        "correctAnswer": "False",
        "explanation": "There are 1920 Sales employees in Europe."
      },
      {
        "id": "q3-5",
        "statement": "The HR department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-5",
        "statement": "Africa experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for Africa was 12.4%."
      },
      {
        "id": "q5-5",
        "statement": "The customer satisfaction score for Hardware in North America is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-6",
    "title": "Corporate Global Report - Dataset 6",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Hardware",
            "Software",
            "Services",
            "Total"
          ],
          "rows": [
            [
              "Africa",
              "490.5",
              "143.2",
              "161.1",
              "794.8"
            ],
            [
              "North America",
              "389.2",
              "493.7",
              "416.9",
              "1299.8"
            ],
            [
              "Europe",
              "242.1",
              "103.5",
              "68.9",
              "414.5"
            ],
            [
              "Asia Pacific",
              "234.1",
              "186.4",
              "320.0",
              "740.5"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "HR",
            "Support",
            "Operations",
            "Sales",
            "Engineering",
            "Total"
          ],
          "rows": [
            [
              "Africa",
              "641",
              "676",
              "300",
              "196",
              "577",
              "2390"
            ],
            [
              "North America",
              "1793",
              "1912",
              "1153",
              "1182",
              "1132",
              "7172"
            ],
            [
              "Europe",
              "966",
              "1252",
              "1471",
              "911",
              "1387",
              "5987"
            ],
            [
              "Asia Pacific",
              "787",
              "562",
              "1565",
              "386",
              "608",
              "3908"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Africa",
              "27.5%",
              "-1.7%",
              "25.7%",
              "24.1%"
            ],
            [
              "North America",
              "15.2%",
              "1.7%",
              "1.7%",
              "-5.2%"
            ],
            [
              "Europe",
              "1.7%",
              "20.7%",
              "15.7%",
              "-8.7%"
            ],
            [
              "Asia Pacific",
              "13.4%",
              "-2.1%",
              "15.9%",
              "29.2%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "HR",
              "5.5",
              "1.6",
              "3.9"
            ],
            [
              "Support",
              "12.4",
              "9.0",
              "3.4"
            ],
            [
              "Operations",
              "3.8",
              "2.2",
              "1.6"
            ],
            [
              "Sales",
              "21.7",
              "15.3",
              "6.4"
            ],
            [
              "Engineering",
              "5.7",
              "2.7",
              "3.0"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Africa",
              "4.02",
              "7994",
              "19"
            ],
            [
              "North America",
              "4.14",
              "8323",
              "26"
            ],
            [
              "Europe",
              "4.45",
              "3307",
              "24"
            ],
            [
              "Asia Pacific",
              "3.42",
              "8280",
              "20"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "HR department in Africa is undergoing a massive restructuring in Q3.",
          "The Hardware product line was introduced in late 2022 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-6",
        "statement": "The total sales in Africa is strictly greater than the total sales in North America.",
        "correctAnswer": "False",
        "explanation": "Africa total is 794.8, and North America total is 1299.8."
      },
      {
        "id": "q2-6",
        "statement": "The number of Engineering employees in Europe exceeds 1566.",
        "correctAnswer": "False",
        "explanation": "There are 1387 Engineering employees in Europe."
      },
      {
        "id": "q3-6",
        "statement": "The Support department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-6",
        "statement": "Africa experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for Africa was 27.5%."
      },
      {
        "id": "q5-6",
        "statement": "The customer satisfaction score for Software in North America is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-7",
    "title": "Corporate Global Report - Dataset 7",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Subscriptions",
            "Cloud",
            "Services",
            "Total"
          ],
          "rows": [
            [
              "North America",
              "28.7",
              "148.0",
              "112.6",
              "289.3"
            ],
            [
              "Middle East",
              "195.4",
              "352.0",
              "246.5",
              "793.9"
            ],
            [
              "Europe",
              "452.8",
              "134.8",
              "277.8",
              "865.4"
            ],
            [
              "Asia Pacific",
              "113.5",
              "245.0",
              "277.7",
              "636.2"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Engineering",
            "Sales",
            "Support",
            "Operations",
            "Total"
          ],
          "rows": [
            [
              "North America",
              "1143",
              "1229",
              "257",
              "508",
              "3137"
            ],
            [
              "Middle East",
              "58",
              "732",
              "847",
              "1654",
              "3291"
            ],
            [
              "Europe",
              "1315",
              "1067",
              "250",
              "1075",
              "3707"
            ],
            [
              "Asia Pacific",
              "986",
              "1240",
              "67",
              "850",
              "3143"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "North America",
              "-0.6%",
              "29.1%",
              "7.8%",
              "0.9%"
            ],
            [
              "Middle East",
              "19.7%",
              "10.8%",
              "19.3%",
              "0.5%"
            ],
            [
              "Europe",
              "7.6%",
              "6.8%",
              "29.8%",
              "20.3%"
            ],
            [
              "Asia Pacific",
              "-0.3%",
              "22.3%",
              "27.0%",
              "19.4%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Engineering",
              "27.2",
              "2.7",
              "24.5"
            ],
            [
              "Sales",
              "19.8",
              "4.0",
              "15.8"
            ],
            [
              "Support",
              "35.8",
              "13.9",
              "21.9"
            ],
            [
              "Operations",
              "42.5",
              "11.1",
              "31.4"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "North America",
              "4.79",
              "9170",
              "18"
            ],
            [
              "Middle East",
              "3.11",
              "494",
              "41"
            ],
            [
              "Europe",
              "4.27",
              "5870",
              "42"
            ],
            [
              "Asia Pacific",
              "4.42",
              "6218",
              "8"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Engineering department in North America is undergoing a massive restructuring in Q3.",
          "The Subscriptions product line was introduced in late 2023 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-7",
        "statement": "The total sales in North America is strictly greater than the total sales in Middle East.",
        "correctAnswer": "False",
        "explanation": "North America total is 289.3, and Middle East total is 793.9."
      },
      {
        "id": "q2-7",
        "statement": "The number of Operations employees in Europe exceeds 1234.",
        "correctAnswer": "False",
        "explanation": "There are 1075 Operations employees in Europe."
      },
      {
        "id": "q3-7",
        "statement": "The Sales department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-7",
        "statement": "North America experienced positive growth in Q1.",
        "correctAnswer": "False",
        "explanation": "The Q1 growth for North America was -0.6%."
      },
      {
        "id": "q5-7",
        "statement": "The customer satisfaction score for Cloud in Middle East is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-8",
    "title": "Corporate Global Report - Dataset 8",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Services",
            "Software",
            "Consulting",
            "Total"
          ],
          "rows": [
            [
              "Latin America",
              "441.7",
              "392.2",
              "294.6",
              "1128.5"
            ],
            [
              "Asia Pacific",
              "452.1",
              "398.1",
              "288.0",
              "1138.2"
            ],
            [
              "Middle East",
              "497.7",
              "48.0",
              "406.8",
              "952.5"
            ],
            [
              "Europe",
              "269.7",
              "318.6",
              "202.0",
              "790.3"
            ],
            [
              "North America",
              "356.4",
              "407.1",
              "146.1",
              "909.6"
            ],
            [
              "Africa",
              "473.3",
              "492.0",
              "474.4",
              "1439.7"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Engineering",
            "Sales",
            "Operations",
            "Marketing",
            "HR",
            "Support",
            "Total"
          ],
          "rows": [
            [
              "Latin America",
              "214",
              "237",
              "392",
              "1064",
              "1797",
              "760",
              "4464"
            ],
            [
              "Asia Pacific",
              "1378",
              "1065",
              "617",
              "1864",
              "1559",
              "1333",
              "7816"
            ],
            [
              "Middle East",
              "216",
              "206",
              "256",
              "194",
              "713",
              "590",
              "2175"
            ],
            [
              "Europe",
              "426",
              "1615",
              "1266",
              "1562",
              "512",
              "1396",
              "6777"
            ],
            [
              "North America",
              "776",
              "1931",
              "737",
              "1881",
              "1540",
              "165",
              "7030"
            ],
            [
              "Africa",
              "1345",
              "1557",
              "934",
              "262",
              "1966",
              "984",
              "7048"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Latin America",
              "-1.2%",
              "27.7%",
              "8.1%",
              "26.6%"
            ],
            [
              "Asia Pacific",
              "1.5%",
              "27.8%",
              "-1.7%",
              "19.5%"
            ],
            [
              "Middle East",
              "15.1%",
              "7.4%",
              "18.9%",
              "29.9%"
            ],
            [
              "Europe",
              "-9.3%",
              "5.2%",
              "-5.6%",
              "-8.5%"
            ],
            [
              "North America",
              "6.2%",
              "-5.6%",
              "4.6%",
              "-1.0%"
            ],
            [
              "Africa",
              "27.0%",
              "-0.8%",
              "18.5%",
              "29.9%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Engineering",
              "38.6",
              "13.1",
              "25.5"
            ],
            [
              "Sales",
              "2.4",
              "2.1",
              "0.3"
            ],
            [
              "Operations",
              "6.3",
              "3.4",
              "2.9"
            ],
            [
              "Marketing",
              "40.3",
              "38.2",
              "2.1"
            ],
            [
              "HR",
              "13.3",
              "12.4",
              "0.9"
            ],
            [
              "Support",
              "12.8",
              "9.6",
              "3.2"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Latin America",
              "3.3",
              "3461",
              "49"
            ],
            [
              "Asia Pacific",
              "3.09",
              "2131",
              "36"
            ],
            [
              "Middle East",
              "4.47",
              "9231",
              "22"
            ],
            [
              "Europe",
              "4.11",
              "3102",
              "27"
            ],
            [
              "North America",
              "3.1",
              "8081",
              "15"
            ],
            [
              "Africa",
              "4.87",
              "2438",
              "42"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Engineering department in Latin America is undergoing a massive restructuring in Q3.",
          "The Services product line was introduced in late 2022 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-8",
        "statement": "The total sales in Latin America is strictly greater than the total sales in Asia Pacific.",
        "correctAnswer": "False",
        "explanation": "Latin America total is 1128.5, and Asia Pacific total is 1138.2."
      },
      {
        "id": "q2-8",
        "statement": "The number of Operations employees in Middle East exceeds 704.",
        "correctAnswer": "False",
        "explanation": "There are 256 Operations employees in Middle East."
      },
      {
        "id": "q3-8",
        "statement": "The Sales department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-8",
        "statement": "Latin America experienced positive growth in Q1.",
        "correctAnswer": "False",
        "explanation": "The Q1 growth for Latin America was -1.2%."
      },
      {
        "id": "q5-8",
        "statement": "The customer satisfaction score for Software in Asia Pacific is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-9",
    "title": "Corporate Global Report - Dataset 9",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Hardware",
            "Cloud",
            "Software",
            "Subscriptions",
            "Total"
          ],
          "rows": [
            [
              "Latin America",
              "116.0",
              "85.9",
              "320.9",
              "280.0",
              "802.8"
            ],
            [
              "Asia Pacific",
              "157.6",
              "291.5",
              "37.6",
              "270.8",
              "757.5"
            ],
            [
              "Europe",
              "358.1",
              "328.1",
              "411.0",
              "126.2",
              "1223.4"
            ],
            [
              "Africa",
              "280.1",
              "441.5",
              "392.9",
              "401.2",
              "1515.7"
            ],
            [
              "Middle East",
              "155.0",
              "148.5",
              "182.7",
              "348.4",
              "834.6"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Sales",
            "Engineering",
            "Operations",
            "Marketing",
            "HR",
            "Support",
            "Total"
          ],
          "rows": [
            [
              "Latin America",
              "344",
              "1560",
              "1636",
              "1803",
              "1999",
              "695",
              "8037"
            ],
            [
              "Asia Pacific",
              "701",
              "1667",
              "1988",
              "1374",
              "1276",
              "72",
              "7078"
            ],
            [
              "Europe",
              "1849",
              "942",
              "1753",
              "1183",
              "1933",
              "1000",
              "8660"
            ],
            [
              "Africa",
              "550",
              "1438",
              "1705",
              "1547",
              "1158",
              "215",
              "6613"
            ],
            [
              "Middle East",
              "1457",
              "1948",
              "50",
              "1777",
              "1224",
              "1813",
              "8269"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "Latin America",
              "13.3%",
              "-0.3%",
              "3.3%",
              "6.3%"
            ],
            [
              "Asia Pacific",
              "-7.3%",
              "-5.2%",
              "1.8%",
              "8.7%"
            ],
            [
              "Europe",
              "27.9%",
              "8.1%",
              "9.6%",
              "19.2%"
            ],
            [
              "Africa",
              "1.7%",
              "11.9%",
              "19.6%",
              "1.4%"
            ],
            [
              "Middle East",
              "28.5%",
              "18.1%",
              "-5.9%",
              "19.9%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Sales",
              "7.1",
              "4.2",
              "2.9"
            ],
            [
              "Engineering",
              "30.1",
              "30.0",
              "0.1"
            ],
            [
              "Operations",
              "44.6",
              "16.0",
              "28.6"
            ],
            [
              "Marketing",
              "7.3",
              "2.7",
              "4.6"
            ],
            [
              "HR",
              "22.3",
              "15.1",
              "7.2"
            ],
            [
              "Support",
              "7.9",
              "4.6",
              "3.3"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "Latin America",
              "4.99",
              "284",
              "12"
            ],
            [
              "Asia Pacific",
              "3.24",
              "968",
              "11"
            ],
            [
              "Europe",
              "3.19",
              "9712",
              "50"
            ],
            [
              "Africa",
              "4.17",
              "4172",
              "47"
            ],
            [
              "Middle East",
              "4.27",
              "7194",
              "35"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Sales department in Latin America is undergoing a massive restructuring in Q3.",
          "The Hardware product line was introduced in late 2022 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-9",
        "statement": "The total sales in Latin America is strictly greater than the total sales in Asia Pacific.",
        "correctAnswer": "True",
        "explanation": "Latin America total is 802.8, and Asia Pacific total is 757.5."
      },
      {
        "id": "q2-9",
        "statement": "The number of Marketing employees in Europe exceeds 1537.",
        "correctAnswer": "False",
        "explanation": "There are 1183 Marketing employees in Europe."
      },
      {
        "id": "q3-9",
        "statement": "The Engineering department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-9",
        "statement": "Latin America experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for Latin America was 13.3%."
      },
      {
        "id": "q5-9",
        "statement": "The customer satisfaction score for Cloud in Asia Pacific is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  },
  {
    "id": "di-lvl-10",
    "title": "Corporate Global Report - Dataset 10",
    "tabs": [
      {
        "id": "tab-1",
        "title": "Sales",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Cloud",
            "Software",
            "Hardware",
            "Subscriptions",
            "Services",
            "Total"
          ],
          "rows": [
            [
              "North America",
              "281.7",
              "200.6",
              "235.5",
              "302.3",
              "17.3",
              "1037.4"
            ],
            [
              "Europe",
              "226.4",
              "357.5",
              "134.3",
              "59.5",
              "390.2",
              "1167.9"
            ],
            [
              "Asia Pacific",
              "289.2",
              "19.6",
              "56.6",
              "35.7",
              "472.1",
              "873.2"
            ],
            [
              "Africa",
              "250.2",
              "172.0",
              "305.0",
              "478.4",
              "255.2",
              "1460.8"
            ]
          ]
        }
      },
      {
        "id": "tab-2",
        "title": "Headcount",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Marketing",
            "Support",
            "Sales",
            "Engineering",
            "HR",
            "Total"
          ],
          "rows": [
            [
              "North America",
              "1880",
              "1917",
              "1933",
              "255",
              "340",
              "6325"
            ],
            [
              "Europe",
              "1208",
              "341",
              "1528",
              "703",
              "126",
              "3906"
            ],
            [
              "Asia Pacific",
              "680",
              "196",
              "1375",
              "670",
              "1117",
              "4038"
            ],
            [
              "Africa",
              "1563",
              "773",
              "1155",
              "584",
              "352",
              "4427"
            ]
          ]
        }
      },
      {
        "id": "tab-3",
        "title": "QoQ Growth",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Q1",
            "Q2",
            "Q3",
            "Q4"
          ],
          "rows": [
            [
              "North America",
              "13.8%",
              "-5.7%",
              "-4.8%",
              "13.6%"
            ],
            [
              "Europe",
              "6.1%",
              "-3.9%",
              "21.0%",
              "7.6%"
            ],
            [
              "Asia Pacific",
              "17.5%",
              "26.2%",
              "8.7%",
              "5.8%"
            ],
            [
              "Africa",
              "-2.7%",
              "17.1%",
              "19.2%",
              "0.5%"
            ]
          ]
        }
      },
      {
        "id": "tab-4",
        "title": "Budget",
        "type": "table",
        "content": {
          "headers": [
            "Department",
            "Allocated ($M)",
            "Spent ($M)",
            "Remaining ($M)"
          ],
          "rows": [
            [
              "Marketing",
              "25.1",
              "23.9",
              "1.2"
            ],
            [
              "Support",
              "7.6",
              "2.8",
              "4.8"
            ],
            [
              "Sales",
              "27.4",
              "7.2",
              "20.2"
            ],
            [
              "Engineering",
              "25.0",
              "5.4",
              "19.6"
            ],
            [
              "HR",
              "2.6",
              "2.5",
              "0.1"
            ]
          ]
        }
      },
      {
        "id": "tab-5",
        "title": "CSAT",
        "type": "table",
        "content": {
          "headers": [
            "Region",
            "Score (1-5)",
            "Total Responses",
            "Escalations"
          ],
          "rows": [
            [
              "North America",
              "4.92",
              "2918",
              "40"
            ],
            [
              "Europe",
              "4",
              "8892",
              "42"
            ],
            [
              "Asia Pacific",
              "4.9",
              "6746",
              "21"
            ],
            [
              "Africa",
              "3.95",
              "1638",
              "30"
            ]
          ]
        }
      },
      {
        "id": "tab-6",
        "title": "Notes",
        "type": "list",
        "content": [
          "All financial values are in USD Millions unless otherwise stated.",
          "Marketing department in North America is undergoing a massive restructuring in Q3.",
          "The Cloud product line was introduced in late 2024 and is expected to grow by 20% next year.",
          "Customer satisfaction scores below 4.0 require a mandatory review by the Support team.",
          "Budget figures exclude capital expenditures and one-time acquisition costs.",
          "Employee headcount includes both full-time and contractor positions."
        ]
      }
    ],
    "questions": [
      {
        "id": "q1-10",
        "statement": "The total sales in North America is strictly greater than the total sales in Europe.",
        "correctAnswer": "False",
        "explanation": "North America total is 1037.4, and Europe total is 1167.9."
      },
      {
        "id": "q2-10",
        "statement": "The number of Sales employees in Asia Pacific exceeds 1844.",
        "correctAnswer": "False",
        "explanation": "There are 1375 Sales employees in Asia Pacific."
      },
      {
        "id": "q3-10",
        "statement": "The Support department will receive a budget increase of at least 10% next year due to their high spending.",
        "correctAnswer": "Cannot Say",
        "explanation": "The data provides current budget allocations but no projections or rules for next year's budget."
      },
      {
        "id": "q4-10",
        "statement": "North America experienced positive growth in Q1.",
        "correctAnswer": "True",
        "explanation": "The Q1 growth for North America was 13.8%."
      },
      {
        "id": "q5-10",
        "statement": "The customer satisfaction score for Software in Europe is higher than the global average.",
        "correctAnswer": "Cannot Say",
        "explanation": "The CSAT data is provided by region, not broken down by individual products."
      }
    ]
  }
];
