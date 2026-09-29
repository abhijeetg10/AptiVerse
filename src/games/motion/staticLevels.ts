// Auto-generated 1D-sliding hard puzzles
import type { PuzzleDefinition } from './types';

export const staticLevels: PuzzleDefinition[] = [
  {
    "id": "motion_h_01",
    "difficulty": "hard",
    "rows": 6,
    "cols": 6,
    "ball": { "row": 2, "col": 4 },
    "target": { "row": 0, "col": 1 },
    "walls": [
      { "row": 0, "col": 3 },
      { "row": 0, "col": 5 }
    ],
    "blocks": [
      { "id": "A", "orientation": "vertical",   "length": 2, "row": 1, "col": 1 },
      { "id": "B", "orientation": "horizontal", "length": 2, "row": 4, "col": 2 },
      { "id": "C", "orientation": "vertical",   "length": 2, "row": 4, "col": 0 },
      { "id": "D", "orientation": "horizontal", "length": 3, "row": 1, "col": 2 },
      { "id": "E", "orientation": "horizontal", "length": 3, "row": 3, "col": 0 },
      { "id": "F", "orientation": "horizontal", "length": 2, "row": 2, "col": 2 },
      { "id": "G", "orientation": "vertical",   "length": 3, "row": 0, "col": 0 },
      { "id": "H", "orientation": "vertical",   "length": 3, "row": 2, "col": 5 },
      { "id": "I", "orientation": "vertical",   "length": 2, "row": 3, "col": 4 }
    ],
    "optimalMoves": 10
  },
  {
    "id": "motion_vh_01",
    "difficulty": "very-hard",
    "rows": 6,
    "cols": 6,
    "ball": { "row": 5, "col": 0 },
    "target": { "row": 0, "col": 5 },
    "walls": [
      { "row": 0, "col": 3 }
    ],
    "blocks": [
      { "id": "A", "orientation": "horizontal", "length": 2, "row": 1, "col": 1 },
      { "id": "B", "orientation": "vertical",   "length": 3, "row": 1, "col": 4 },
      { "id": "C", "orientation": "vertical",   "length": 2, "row": 3, "col": 0 },
      { "id": "D", "orientation": "horizontal", "length": 2, "row": 4, "col": 3 },
      { "id": "E", "orientation": "horizontal", "length": 2, "row": 0, "col": 1 },
      { "id": "F", "orientation": "vertical",   "length": 3, "row": 1, "col": 5 },
      { "id": "G", "orientation": "vertical",   "length": 3, "row": 3, "col": 2 },
      { "id": "H", "orientation": "vertical",   "length": 3, "row": 1, "col": 3 }
    ],
    "optimalMoves": 12
  },
  ...[
  {
    "id": "motion_gen_01",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 5,
      "col": 5
    },
    "target": {
      "row": 4,
      "col": 0
    },
    "walls": [
      {
        "row": 4,
        "col": 1
      },
      {
        "row": 5,
        "col": 1
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 2,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 5,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 0,
        "col": 2,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 2,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 3,
        "row": 1,
        "col": 0,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 3,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 4,
        "color": "yellow"
      }
    ],
    "optimalMoves": 11
  },
  {
    "id": "motion_gen_02",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 2,
      "col": 1
    },
    "target": {
      "row": 1,
      "col": 4
    },
    "walls": [
      {
        "row": 1,
        "col": 3
      },
      {
        "row": 2,
        "col": 5
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 2,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 2,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 0,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 3,
        "row": 3,
        "col": 3,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 0,
        "color": "blue"
      }
    ],
    "optimalMoves": 12
  },
  {
    "id": "motion_gen_03",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 1,
      "col": 0
    },
    "target": {
      "row": 5,
      "col": 5
    },
    "walls": [
      {
        "row": 5,
        "col": 1
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 1,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 2,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 4,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 5,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 2,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 1,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "horizontal",
        "length": 3,
        "row": 5,
        "col": 3,
        "color": "yellow"
      }
    ],
    "optimalMoves": 11
  },
  {
    "id": "motion_gen_04",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 4,
      "col": 3
    },
    "target": {
      "row": 2,
      "col": 0
    },
    "walls": [
      {
        "row": 0,
        "col": 5
      },
      {
        "row": 4,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 2,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 1,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 1,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 5,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 3,
        "color": "blue"
      }
    ],
    "optimalMoves": 9
  },
  {
    "id": "motion_gen_05",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 3,
      "col": 1
    },
    "target": {
      "row": 0,
      "col": 3
    },
    "walls": [
      {
        "row": 0,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 3,
        "row": 2,
        "col": 5,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 2,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 4,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 2,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 2,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 0,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 0,
        "color": "yellow"
      }
    ],
    "optimalMoves": 9
  },
  {
    "id": "motion_gen_06",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 1,
      "col": 3
    },
    "target": {
      "row": 5,
      "col": 0
    },
    "walls": [
      {
        "row": 1,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 3,
        "row": 5,
        "col": 3,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 0,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 0,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 3,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 1,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 5,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 3,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 0,
        "color": "yellow"
      }
    ],
    "optimalMoves": 8
  },
  {
    "id": "motion_gen_07",
    "rows": 6,
    "cols": 6,
    "difficulty": "very-hard",
    "ball": {
      "row": 4,
      "col": 4
    },
    "target": {
      "row": 1,
      "col": 0
    },
    "walls": [
      {
        "row": 1,
        "col": 4
      },
      {
        "row": 2,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 3,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 3,
        "row": 1,
        "col": 5,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 0,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 1,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 2,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 3,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 1,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "horizontal",
        "length": 3,
        "row": 3,
        "col": 1,
        "color": "yellow"
      }
    ],
    "optimalMoves": 13
  },
  {
    "id": "motion_gen_08",
    "rows": 6,
    "cols": 6,
    "difficulty": "very-hard",
    "ball": {
      "row": 0,
      "col": 3
    },
    "target": {
      "row": 5,
      "col": 5
    },
    "walls": [
      {
        "row": 0,
        "col": 5
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 3,
        "row": 1,
        "col": 3,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 1,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 4,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 1,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 0,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 2,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 3,
        "color": "yellow"
      }
    ],
    "optimalMoves": 15
  },
  {
    "id": "motion_gen_09",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 5,
      "col": 0
    },
    "target": {
      "row": 2,
      "col": 3
    },
    "walls": [
      {
        "row": 4,
        "col": 0
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 0,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 3,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 1,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 2,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 0,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 3,
        "color": "blue"
      }
    ],
    "optimalMoves": 9
  },
  {
    "id": "motion_gen_10",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 5,
      "col": 4
    },
    "target": {
      "row": 2,
      "col": 2
    },
    "walls": [
      {
        "row": 3,
        "col": 3
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 3,
        "row": 2,
        "col": 1,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 3,
        "row": 0,
        "col": 2,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 2,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 2,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 4,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 3,
        "row": 2,
        "col": 2,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 0,
        "color": "blue"
      }
    ],
    "optimalMoves": 12
  },
  {
    "id": "motion_gen_11",
    "rows": 6,
    "cols": 6,
    "difficulty": "very-hard",
    "ball": {
      "row": 2,
      "col": 5
    },
    "target": {
      "row": 4,
      "col": 4
    },
    "walls": [
      {
        "row": 0,
        "col": 5
      },
      {
        "row": 0,
        "col": 5
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 3,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 2,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 1,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 0,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 1,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 2,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "vertical",
        "length": 3,
        "row": 2,
        "col": 0,
        "color": "yellow"
      }
    ],
    "optimalMoves": 13
  },
  {
    "id": "motion_gen_12",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 5,
      "col": 3
    },
    "target": {
      "row": 0,
      "col": 4
    },
    "walls": [
      {
        "row": 2,
        "col": 4
      },
      {
        "row": 4,
        "col": 0
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 2,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 0,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 3,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 5,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 1,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 1,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 2,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 1,
        "color": "yellow"
      }
    ],
    "optimalMoves": 10
  },
  {
    "id": "motion_gen_13",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 3,
      "col": 0
    },
    "target": {
      "row": 1,
      "col": 5
    },
    "walls": [
      {
        "row": 1,
        "col": 0
      },
      {
        "row": 5,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 3,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 2,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 2,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 1,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 2,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 2,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 0,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "horizontal",
        "length": 2,
        "row": 0,
        "col": 2,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "vertical",
        "length": 3,
        "row": 1,
        "col": 5,
        "color": "yellow"
      }
    ],
    "optimalMoves": 9
  },
  {
    "id": "motion_gen_14",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 5,
      "col": 1
    },
    "target": {
      "row": 2,
      "col": 0
    },
    "walls": [
      {
        "row": 4,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 1,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 2,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "horizontal",
        "length": 3,
        "row": 2,
        "col": 1,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 0,
        "col": 4,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 3,
        "row": 0,
        "col": 0,
        "color": "orange"
      }
    ],
    "optimalMoves": 8
  },
  {
    "id": "motion_gen_15",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 2,
      "col": 0
    },
    "target": {
      "row": 5,
      "col": 5
    },
    "walls": [
      {
        "row": 4,
        "col": 2
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 1,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 3,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 2,
        "row": 0,
        "col": 4,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 3,
        "row": 1,
        "col": 1,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 3,
        "row": 3,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 0,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 1,
        "color": "blue"
      }
    ],
    "optimalMoves": 10
  },
  {
    "id": "motion_gen_16",
    "rows": 6,
    "cols": 6,
    "difficulty": "hard",
    "ball": {
      "row": 1,
      "col": 5
    },
    "target": {
      "row": 5,
      "col": 0
    },
    "walls": [
      {
        "row": 2,
        "col": 0
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 4,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "vertical",
        "length": 2,
        "row": 0,
        "col": 1,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 3,
        "row": 1,
        "col": 2,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 3,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 0,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 4,
        "col": 1,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 2,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "horizontal",
        "length": 2,
        "row": 5,
        "col": 4,
        "color": "blue"
      }
    ],
    "optimalMoves": 9
  },
  {
    "id": "motion_gen_17",
    "rows": 6,
    "cols": 6,
    "difficulty": "very-hard",
    "ball": {
      "row": 0,
      "col": 5
    },
    "target": {
      "row": 4,
      "col": 0
    },
    "walls": [
      {
        "row": 5,
        "col": 0
      },
      {
        "row": 5,
        "col": 4
      }
    ],
    "blocks": [
      {
        "id": "b0",
        "orientation": "vertical",
        "length": 3,
        "row": 3,
        "col": 2,
        "color": "blue"
      },
      {
        "id": "b1",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 4,
        "color": "yellow"
      },
      {
        "id": "b2",
        "orientation": "horizontal",
        "length": 3,
        "row": 1,
        "col": 0,
        "color": "purple"
      },
      {
        "id": "b3",
        "orientation": "vertical",
        "length": 2,
        "row": 4,
        "col": 3,
        "color": "green"
      },
      {
        "id": "b4",
        "orientation": "vertical",
        "length": 2,
        "row": 2,
        "col": 3,
        "color": "teal"
      },
      {
        "id": "b5",
        "orientation": "horizontal",
        "length": 2,
        "row": 0,
        "col": 3,
        "color": "indigo"
      },
      {
        "id": "b6",
        "orientation": "horizontal",
        "length": 2,
        "row": 3,
        "col": 0,
        "color": "orange"
      },
      {
        "id": "b7",
        "orientation": "vertical",
        "length": 2,
        "row": 3,
        "col": 5,
        "color": "blue"
      },
      {
        "id": "b8",
        "orientation": "horizontal",
        "length": 2,
        "row": 2,
        "col": 0,
        "color": "yellow"
      }
    ],
    "optimalMoves": 13
  }
]
] as PuzzleDefinition[];
