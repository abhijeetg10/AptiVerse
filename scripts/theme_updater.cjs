const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/games/di/DIChallenge.tsx',
  'src/games/rc/RCChallenge.tsx',
  'src/games/inductive/InductiveChallenge.tsx',
  'src/games/motion/MotionChallenge.tsx',
];

const replacements = [
  { from: /bg-slate-50/g, to: 'bg-[#121629]' },
  { from: /bg-slate-100\/50/g, to: 'bg-[#1e233b]/50' },
  { from: /bg-slate-100/g, to: 'bg-[#1e233b]' },
  { from: /bg-slate-200/g, to: 'bg-[#2a304e]' },
  { from: /bg-white/g, to: 'bg-[#1a1f35]' },
  
  { from: /text-slate-900/g, to: 'text-white' },
  { from: /text-slate-800/g, to: 'text-neutral-100' },
  { from: /text-slate-700/g, to: 'text-neutral-300' },
  { from: /text-slate-600/g, to: 'text-neutral-400' },
  { from: /text-slate-500/g, to: 'text-neutral-500' },
  
  { from: /border-slate-200/g, to: 'border-white/10' },
  { from: /border-slate-300/g, to: 'border-white/20' },
  { from: /border-slate-100/g, to: 'border-white/5' },
];

for (const relPath of filesToUpdate) {
  const fullPath = path.join(__dirname, '..', relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${relPath}`);
}
