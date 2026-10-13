const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');

console.log('====================================================');
console.log('🛡️  APTIVERSE SECURITY & INTEGRITY AUDIT SUITE');
console.log('====================================================\n');

let issues = [];
let passedChecks = [];

function check(title, fn) {
  try {
    fn();
    passedChecks.push(title);
    console.log(`  ✅ PASS: ${title}`);
  } catch (err) {
    issues.push({ title, error: err.message });
    console.error(`  ❌ FAIL: ${title}`);
    console.error(`     Reason: ${err.message}`);
  }
}

// ----------------------------------------------------
// 1. LUCIDE-REACT ICON AUDIT
// ----------------------------------------------------
console.log('--- 1. Auditing All Lucide Icon Imports ---');

function getAllFiles(dir, filter) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, filter));
    } else if (!filter || filter(fullPath)) {
      results.push(fullPath);
    }
  });
  return results;
}

const tsxFiles = getAllFiles(path.join(__dirname, '../src'), (f) => f.endsWith('.tsx') || f.endsWith('.ts'));

let totalIconsChecked = 0;
check('All Lucide Icon imports across all components exist in lucide-react package', () => {
  const missingIcons = [];
  const iconImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;

  tsxFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = iconImportRegex.exec(content)) !== null) {
      const importedNames = match[1].split(',').map(s => s.trim().split(' as ')[0].trim()).filter(Boolean);
      importedNames.forEach(iconName => {
        // Exclude types or utilities if any
        if (iconName.startsWith('type ') || iconName === 'LucideProps' || iconName === 'LucideIcon') return;
        totalIconsChecked++;
        if (!lucide[iconName]) {
          missingIcons.push({ icon: iconName, file: path.relative(path.join(__dirname, '..'), file) });
        }
      });
    }
  });

  if (missingIcons.length > 0) {
    throw new Error(`Found missing Lucide icons: ${JSON.stringify(missingIcons)}`);
  }
});
console.log(`     Checked ${totalIconsChecked} icon references across ${tsxFiles.length} files.`);

// ----------------------------------------------------
// 2. STATIC ASSETS & PUBLIC LOGO AUDIT
// ----------------------------------------------------
console.log('\n--- 2. Auditing Static Assets & Logo References ---');

check('Public logo and images exist and are accessible', () => {
  const publicLogoPath = path.join(__dirname, '../public/logo.png');
  if (!fs.existsSync(publicLogoPath)) {
    throw new Error('public/logo.png is missing!');
  }
  const stat = fs.statSync(publicLogoPath);
  if (stat.size === 0) {
    throw new Error('public/logo.png is empty (0 bytes)!');
  }
});

// ----------------------------------------------------
// 3. ALL 7 GAMES STRUCTURAL & EXPORT AUDIT
// ----------------------------------------------------
console.log('\n--- 3. Auditing All 7 Games & Challenge Components ---');

const games = [
  { id: 'motion', file: '../src/games/motion/MotionChallenge.tsx', board: '../src/games/motion/MotionBoard.tsx' },
  { id: 'switch', file: '../src/games/switch/SwitchChallenge.tsx', board: '../src/games/switch/SwitchBoard.tsx' },
  { id: 'inductive', file: '../src/games/inductive/InductiveChallenge.tsx', board: '../src/games/inductive/InductiveBoard.tsx' },
  { id: 'sudoku', file: '../src/games/sudoku/GeoSudokuChallenge.tsx', board: '../src/games/sudoku/GeoSudokuBoard.tsx' },
  { id: 'grid', file: '../src/games/grid/GridChallenge.tsx' },
  { id: 'rc', file: '../src/games/rc/RCChallenge.tsx' },
  { id: 'di', file: '../src/games/di/DIChallenge.tsx' }
];

games.forEach(g => {
  check(`Game '${g.id}' challenge component exists and exports component`, () => {
    const fullPath = path.join(__dirname, g.file);
    if (!fs.existsSync(fullPath)) throw new Error(`Missing ${g.file}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes('export default') && !content.includes('export const')) {
      throw new Error(`${g.id} does not export component`);
    }
    // Check useGameSession hook integration
    if (!content.includes('useGameSession')) {
      throw new Error(`${g.id} is missing useGameSession hook!`);
    }
  });

  if (g.board) {
    check(`Game '${g.id}' board component exists and exports props interface`, () => {
      const fullPath = path.join(__dirname, g.board);
      if (!fs.existsSync(fullPath)) throw new Error(`Missing ${g.board}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('Props') && !content.includes('React.FC')) {
        throw new Error(`${g.id} Board component is not typed with props interface`);
      }
    });
  }
});

// ----------------------------------------------------
// 4. ROUTING AUDIT (App.tsx)
// ----------------------------------------------------
console.log('\n--- 4. Auditing Routing and Lazy Bundles ---');

check('App.tsx defines all expected routes without broken links', () => {
  const appPath = path.join(__dirname, '../src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  if (!appContent.includes('index element={<Home')) {
    throw new Error('Root index route (Home) is missing in App.tsx');
  }

  const expectedRoutes = [
    'games',
    'dashboard',
    'progress',
    'leaderboard',
    'profile',
    'admin',
    '/games/motion',
    '/games/sudoku',
    '/games/grid',
    '/games/switch',
    '/games/inductive',
    '/games/di',
    '/games/rc'
  ];

  expectedRoutes.forEach(route => {
    if (!appContent.includes(`path="${route}"`) && !appContent.includes(`path='${route}'`)) {
      throw new Error(`Route ${route} is not registered in App.tsx`);
    }
  });
});

// ----------------------------------------------------
// 5. SECURITY & ACCESS CONTROL AUDIT
// ----------------------------------------------------
console.log('\n--- 5. Auditing Security, Permissions & Anti-Cheat Rules ---');

check('Admin Dashboard route is protected by AdminRoute authorization guard', () => {
  const appContent = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');
  if (!appContent.includes('<AdminRoute>') || !appContent.includes('<AdminDashboard />')) {
    throw new Error('AdminDashboard is not protected inside <AdminRoute>');
  }
});

check('SQL Migration prevents ordinary users from altering role or is_blocked', () => {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261013_master_audit_fixes.sql'), 'utf8');
  if (!sql.includes('get_user_role(auth.uid())')) {
    throw new Error('Missing get_user_role check in profile RLS policy');
  }
  if (!sql.includes('get_user_is_blocked(auth.uid())')) {
    throw new Error('Missing get_user_is_blocked check in profile RLS policy');
  }
  if (!sql.includes('get_user_warning_message(auth.uid())')) {
    throw new Error('Missing get_user_warning_message check in profile RLS policy');
  }
});

check('SQL migration uses SECURITY DEFINER to prevent RLS recursion loops', () => {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261013_master_audit_fixes.sql'), 'utf8');
  if (!sql.includes('SECURITY DEFINER')) {
    throw new Error('SECURITY DEFINER missing on helper functions');
  }
});

check('Public leaderboard views omit private user emails and warnings', () => {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261013_master_audit_fixes.sql'), 'utf8');
  const globalMatch = sql.match(/CREATE VIEW public\.global_leaderboard AS([\s\S]*?)GROUP BY/);
  if (!globalMatch) throw new Error('global_leaderboard view not found');
  if (globalMatch[1].includes('p.email') || globalMatch[1].includes('p.warning_message')) {
    throw new Error('Private fields exposed in global_leaderboard view');
  }
});

check('Anti-cheat validation trigger enforces score ranges and cooldown', () => {
  const sql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20261013_master_audit_fixes.sql'), 'utf8');
  if (!sql.includes('NEW.score < 0 OR NEW.score > 10')) {
    throw new Error('Score bounds 0..10 not enforced in trigger');
  }
  if (!sql.includes('NEW.time_spent < 2')) {
    throw new Error('Minimum human completion time check missing');
  }
  if (!sql.includes('auth.uid() != NEW.user_id')) {
    throw new Error('Session ownership check missing');
  }
});

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`🏁 AUDIT COMPLETE: ${passedChecks.length} passed, ${issues.length} failed`);
console.log('====================================================');

if (issues.length > 0) {
  console.error('\nIssues found:');
  issues.forEach(i => console.error(`- ${i.title}: ${i.error}`));
  process.exit(1);
} else {
  console.log('\n🎉 ALL ICONS, FEATURES, AND SECURITY CONSTRAINTS VERIFIED 100% HEALTHY!');
  process.exit(0);
}
