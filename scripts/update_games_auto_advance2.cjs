const fs = require('fs');

const files = {
  'src/games/switch/SwitchChallenge.tsx': {
    advanceFn: 'loadNextLevel',
    buttonsRegex: /<div className=\"flex flex-col gap-3\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/
  },
  'src/games/rc/RCChallenge.tsx': {
    advanceFn: 'loadNextLevel',
    buttonsRegex: /<div className=\"flex gap-4 w-full\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*\)}/
  },
  'src/games/motion/MotionChallenge.tsx': {
    advanceFn: 'loadNextLevel',
    buttonsRegex: /<div className=\"flex flex-col gap-3\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/
  },
  'src/games/inductive/InductiveChallenge.tsx': {
    advanceFn: 'loadNextLevel',
    buttonsRegex: /<div className=\"flex flex-col gap-3\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/
  },
  'src/games/di/DIChallenge.tsx': {
    advanceFn: 'handleNextLevel',
    buttonsRegex: /<div className=\"flex gap-4 w-full\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*\)}/
  },
  'src/games/grid/GridChallenge.tsx': {
    advanceFn: 'loadNextLevel',
    buttonsRegex: /<div className=\"flex flex-col gap-3\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/
  },
  'src/games/sudoku/GeoSudokuChallenge.tsx': {
    advanceFn: 'loadNextLevel',
    buttonsRegex: /<div className=\"flex flex-col gap-3\">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*\)}/
  }
};

for (const [file, info] of Object.entries(files)) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add hook import
  if (!content.includes('useAutoAdvance')) {
    content = content.replace(/(import .*?from 'lucide-react';)/, '$1\nimport { useAutoAdvance } from \'../../hooks/useAutoAdvance\';');
  }

  // 2. Remove useState for isFeedbackOpen
  content = content.replace(/const \[isFeedbackOpen, setIsFeedbackOpen\] = useState\(false\);\n?\s*/g, '');

  // 3. Add useAutoAdvance hook after advanceFn is declared
  const hookStr = `  const { isFeedbackOpen, handleFeedbackClose, handleFeedbackSubmit } = useAutoAdvance(state.status === 'completed', ${info.advanceFn});\n`;
  if (!content.includes('useAutoAdvance(state.status')) {
    const fnRegex = new RegExp(`(const ${info.advanceFn} = .*?=> {\\n(?:.|\\n)*?\\n  };\\n)`);
    content = content.replace(fnRegex, `$1\n${hookStr}`);
  }

  // 4. Remove buttons
  content = content.replace(info.buttonsRegex, '</div>\n              </div>\n            )}');

  // 5. Update FeedbackModal props
  content = content.replace(
    /<FeedbackModal\s+isOpen=\{isFeedbackOpen\}\s+onClose=\{\(\) => setIsFeedbackOpen\(false\)\}\s+onSubmit=\{\(\) => setIsFeedbackOpen\(false\)\}\s+\/>/g,
    '<FeedbackModal isOpen={isFeedbackOpen} onClose={handleFeedbackClose} onSubmit={handleFeedbackSubmit} />'
  );

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
}
