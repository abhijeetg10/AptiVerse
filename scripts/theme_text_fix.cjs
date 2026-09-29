const fs = require('fs');
const path = require('path');

const lightFiles = [
  'src/games/grid/GridChallenge.tsx',
  'src/games/switch/SwitchChallenge.tsx',
  'src/games/sudoku/GeoSudokuChallenge.tsx',
];

const textConversions = [
  { from: 'text-2xl font-bold text-white', to: 'text-2xl font-bold text-slate-800' },
  { from: 'text-3xl font-extrabold text-white', to: 'text-3xl font-extrabold text-slate-800' },
  { from: 'text-3xl font-bold text-white', to: 'text-3xl font-bold text-slate-800' },
  { from: "timeLeft < 60 ? 'text-red-400' : 'text-white'", to: "timeLeft < 60 ? 'text-red-500' : 'text-slate-800'" },
  { from: 'hover:text-white', to: 'hover:text-slate-700' },
  { from: 'bg-white text-white', to: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  { from: 'text-sm font-bold text-white mb-3', to: 'text-sm font-bold text-slate-800 mb-3' }
];

for (const relPath of lightFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  for (const { from, to } of textConversions) {
    content = content.split(from).join(to);
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Fixed texts in: ${relPath}`);
}
