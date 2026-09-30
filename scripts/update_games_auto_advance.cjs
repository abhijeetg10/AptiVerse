const fs = require('fs');
const path = require('path');

const game = 'sudoku/GeoSudokuChallenge.tsx';
const filePath = path.join(__dirname, '..', 'src', 'games', game);

let content = fs.readFileSync(filePath, 'utf8');

// 1. Add useAutoAdvance import if it doesn't exist
if (!content.includes('useAutoAdvance')) {
  // find useGameSession import and put it after
  content = content.replace(
    /(import { useGameSession } from '.*?';\n)/,
    `$1import { useAutoAdvance } from '../../hooks/useAutoAdvance';\n`
  );
}

// 2. Remove const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
content = content.replace(/const \[isFeedbackOpen, setIsFeedbackOpen\] = useState\(false\);\n?\s*/g, '');

// 3. Add useAutoAdvance hook after useGameSession
const autoAdvanceHookStr = `  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', loadNextLevel);\n`;
if (!content.includes('useAutoAdvance(state.status')) {
  content = content.replace(
    /(const { saveSession } = useGameSession\('.*?'\);\n)/,
    `$1${autoAdvanceHookStr}`
  );
}

// 4. Update the completed popup by removing the buttons
content = content.replace(
  /<div className="flex flex-col gap-3">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/m,
  `</div>\n              </div>\n            )}`
);

// 5. Update FeedbackModal props
content = content.replace(
  /<FeedbackModal\s+isOpen={isFeedbackOpen}\s+onClose={\(\) => setIsFeedbackOpen\(false\)}\s+onSubmit={\(\) => setIsFeedbackOpen\(false\)}\s+\/>/g,
  `<FeedbackModal \n        isOpen={isFeedbackOpen} \n        onClose={handleFeedbackClose} \n        onSubmit={handleFeedbackSubmit} \n      />`
);

fs.writeFileSync(filePath, content);
console.log(`Updated ${game}`);
