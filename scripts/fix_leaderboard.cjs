const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '..', 'src', 'pages', 'Leaderboard.tsx');
let content = fs.readFileSync(filepath, 'utf8');

const target = `<img src={row.avatar} alt="" className="w-8 h-8 rounded-full bg-neutral-200 object-cover" />`;
const replacement = `<div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs shadow-sm shrink-0">{getInitial(row.name)}</div>`;

content = content.replace(target, replacement);

fs.writeFileSync(filepath, content);
console.log('Done!');
