const fs = require('fs');

const files = [
  { path: 'src/games/switch/SwitchChallenge.tsx', advanceFn: 'loadNextLevel' },
  { path: 'src/games/rc/RCChallenge.tsx', advanceFn: 'loadNextLevel' },
  { path: 'src/games/motion/MotionChallenge.tsx', advanceFn: 'loadNextLevel' },
  { path: 'src/games/inductive/InductiveChallenge.tsx', advanceFn: 'loadNextLevel' },
  { path: 'src/games/di/DIChallenge.tsx', advanceFn: 'handleNextLevel' },
  { path: 'src/games/grid/GridChallenge.tsx', advanceFn: 'loadNextLevel' },
  { path: 'src/games/sudoku/GeoSudokuChallenge.tsx', advanceFn: 'loadNextLevel' },
];

for (const { path, advanceFn } of files) {
  let content = fs.readFileSync(path, 'utf8');

  // 1. Add hook import
  if (!content.includes('useAutoAdvance')) {
    content = content.replace(/(import .*?from 'lucide-react';)/, "$1\nimport { useAutoAdvance } from '../../hooks/useAutoAdvance';");
  }

  // 2. Remove useState for isFeedbackOpen
  content = content.replace(/const \[isFeedbackOpen, setIsFeedbackOpen\] = useState\(false\);\n?/g, '');

  // 3. Add useAutoAdvance hook after advanceFn is declared
  const hookStr = `\n  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', ${advanceFn});\n`;
  if (!content.includes('useAutoAdvance(state.status')) {
    // Find the definition of advanceFn
    const regex = new RegExp(`(const ${advanceFn} = \\(\\) => {[^}]*};)`);
    content = content.replace(regex, `$1${hookStr}`);
  }

  // 4. Remove Next Level and Leave Feedback buttons
  content = content.replace(/<div className="flex flex-col gap-3">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/m, '</div>\n              </div>\n            )}');
  content = content.replace(/<div className="flex gap-4 w-full">[\s\S]*?<\/div>\n\s*<\/div>\n\s*\)}/m, '</div>\n              </div>\n            )}');

  // 5. Update FeedbackModal
  content = content.replace(
    /<FeedbackModal \n?\s*isOpen=\{isFeedbackOpen\} \n?\s*onClose=\{\(\) => setIsFeedbackOpen\(false\)\} \n?\s*onSubmit=\{\(\) => setIsFeedbackOpen\(false\)\} \n?\s*\/>/g,
    '<FeedbackModal \n        isOpen={isFeedbackOpen} \n        onClose={handleFeedbackClose} \n        onSubmit={handleFeedbackSubmit} \n      />'
  );

  fs.writeFileSync(path, content);
  console.log('Updated ' + path);
}
