const fs = require('fs');
const path = require('path');

const revertFiles = [
  'src/games/di/DIChallenge.tsx',
  'src/games/rc/RCChallenge.tsx',
  'src/games/inductive/InductiveChallenge.tsx',
  'src/games/motion/MotionChallenge.tsx',
];

const revertReplacements = [
  { from: /bg-\[\#121629\]/g, to: 'bg-slate-50' },
  { from: /bg-\[\#1e233b\]\/50/g, to: 'bg-slate-100/50' },
  { from: /bg-\[\#1e233b\]/g, to: 'bg-slate-100' },
  { from: /bg-\[\#2a304e\]/g, to: 'bg-slate-200' },
  { from: /bg-\[\#1a1f35\]/g, to: 'bg-white' },
  
  { from: /text-white/g, to: 'text-slate-900' }, // This might incorrectly revert actual text-white inside buttons, so we need to be careful. Wait, I'll use a better approach below.
];

// Let's do string replacement for the revert carefully.
// Actually, it's safer if I just do exact replacements for the ones I messed up.
// Or I can just git checkout them? But git is not initialized properly.
// Let's use exact strings.
const exactReverts = [
  { from: 'bg-[#121629]', to: 'bg-slate-50' },
  { from: 'bg-[#1e233b]/50', to: 'bg-slate-100/50' },
  { from: 'bg-[#1e233b]', to: 'bg-slate-100' },
  { from: 'bg-[#2a304e]', to: 'bg-slate-200' },
  { from: 'bg-[#1a1f35]', to: 'bg-white' },
  
  { from: 'text-white', to: 'text-slate-900' },
  { from: 'text-neutral-100', to: 'text-slate-800' },
  { from: 'text-neutral-300', to: 'text-slate-700' },
  { from: 'text-neutral-400', to: 'text-slate-600' },
  { from: 'text-neutral-500', to: 'text-slate-500' },
  
  { from: 'border-white/10', to: 'border-slate-200' },
  { from: 'border-white/20', to: 'border-slate-300' },
  { from: 'border-white/5', to: 'border-slate-100' },
];

for (const relPath of revertFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  for (const { from, to } of exactReverts) {
    content = content.split(from).join(to);
  }
  
  // Fix button texts that should have stayed white
  content = content.split('text-slate-900 font-bold shadow-md shadow-blue-600/20').join('text-white font-bold shadow-md shadow-blue-600/20');
  content = content.split('text-slate-900 font-bold shadow-md shadow-emerald-600/20').join('text-white font-bold shadow-md shadow-emerald-600/20');
  content = content.split('bg-[#0a192f] text-slate-900').join('bg-[#0a192f] text-white'); // Motion header
  content = content.split('<span className="text-slate-900">AptiVerse</span>').join('<span className="text-white">AptiVerse</span>');
  content = content.split("timeLeft < 60 ? 'text-red-400' : 'text-slate-900'").join("timeLeft < 60 ? 'text-red-400' : 'text-white'");
  
  fs.writeFileSync(fullPath, content);
  console.log(`Reverted ${relPath}`);
}

// Now convert Grid, Switch, GeoSudoku to light theme
const lightFiles = [
  'src/games/grid/GridChallenge.tsx',
  'src/games/switch/SwitchChallenge.tsx',
  'src/games/sudoku/GeoSudokuChallenge.tsx',
];

const lightConversions = [
  { from: 'bg-neutral-900 text-white', to: 'bg-slate-50 text-slate-900' },
  { from: 'bg-neutral-900', to: 'bg-slate-50' },
  { from: 'bg-neutral-800', to: 'bg-white' },
  { from: 'bg-neutral-800/50', to: 'bg-white/50' },
  { from: 'border-neutral-800/50', to: 'border-slate-200/50' },
  { from: 'border-neutral-800', to: 'border-slate-200' },
  { from: 'border-neutral-700', to: 'border-slate-200' },
  { from: 'text-neutral-400', to: 'text-slate-500' },
  { from: 'text-neutral-500', to: 'text-slate-500' },
  { from: 'bg-neutral-950', to: 'bg-slate-100' },
  { from: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950', to: 'bg-slate-50' },
  { from: 'bg-neutral-800/80', to: 'bg-slate-100/80' },
  { from: 'border-white/10', to: 'border-slate-200' },
];

for (const relPath of lightFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  for (const { from, to } of lightConversions) {
    content = content.split(from).join(to);
  }
  
  // specific fixes for sudoku radial gradient
  content = content.replace(/from-neutral-800 via-neutral-900 to-neutral-950/g, 'bg-slate-50');
  
  fs.writeFileSync(fullPath, content);
  console.log(`Converted to light theme: ${relPath}`);
}
