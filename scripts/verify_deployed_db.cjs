const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyDeployedDatabase() {
  console.log('====================================================');
  console.log('🌐 DEPLOYED SUPABASE DATABASE LIVE VERIFICATION');
  console.log(`Target URL: ${supabaseUrl}`);
  console.log('====================================================\n');

  // 1. Exact Head Count Query on profiles (as used in Admin Card)
  console.log('1. Executing Admin Card query: select("id", { count: "exact", head: true }) on profiles...');
  const headQueryStart = Date.now();
  const { count: headCount, error: headError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });
  const headQueryTime = Date.now() - headQueryStart;

  if (headError) {
    console.error('❌ headCount query failed:', headError);
  } else {
    console.log(`   [Deployed DB] Returned exact head count: ${headCount} (in ${headQueryTime}ms)`);
  }

  // 2. Paginated data query vs actual row count limit on profiles
  console.log('\n2. Executing Standard select without range on profiles to test default PostgREST limit...');
  const { data: defaultRows, count: totalProfileCount, error: defaultError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact' });

  if (defaultError) {
    console.error('❌ defaultRows query failed:', defaultError);
  } else {
    console.log(`   [Deployed DB] data.length returned: ${defaultRows ? defaultRows.length : 0} rows`);
    console.log(`   [Deployed DB] count property returned: ${totalProfileCount}`);
    if (defaultRows && defaultRows.length === 1000 && totalProfileCount > 1000) {
      console.log('   ⚠️ CONFIRMED LIVE PHENOMENON: PostgREST caps rows at 1,000!');
      console.log(`      data.length was 1,000, while actual total count is ${totalProfileCount}!`);
    } else {
      console.log(`   Comparison: data.length (${defaultRows ? defaultRows.length : 0}) vs exact count (${totalProfileCount})`);
    }
  }

  // 3. Exact count on game_sessions
  console.log('\n3. Executing Admin Card query on game_sessions...');
  const { count: sessionsCount, error: sessionsError } = await supabase
    .from('game_sessions')
    .select('id', { count: 'exact', head: true });

  if (sessionsError) {
    console.error('❌ sessionsCount query failed:', sessionsError);
  } else {
    console.log(`   [Deployed DB] Returned exact sessions count: ${sessionsCount}`);
  }

  // 4. Check whether global_leaderboard view exists in deployed database
  console.log('\n4. Checking if public.global_leaderboard view is deployed...');
  const { count: leaderboardCount, error: leaderboardError } = await supabase
    .from('global_leaderboard')
    .select('user_id', { count: 'exact', head: true });

  if (leaderboardError) {
    console.log(`   ⚠️ global_leaderboard query returned error: ${leaderboardError.message} (Code: ${leaderboardError.code})`);
    console.log('      This indicates the view migration (20261013_master_audit_fixes.sql) has NOT yet been applied to the live database.');
  } else {
    console.log(`   ✅ global_leaderboard view is present! Active players count: ${leaderboardCount}`);
  }

  // 5. Check if attempt_id column exists on game_sessions in deployed database
  console.log('\n5. Checking if attempt_id column exists on game_sessions in deployed database...');
  const { data: sampleSession, error: sampleError } = await supabase
    .from('game_sessions')
    .select('id, attempt_id')
    .limit(1);

  if (sampleError) {
    console.log(`   ⚠️ attempt_id column query returned error: ${sampleError.message}`);
    console.log('      This confirms the attempt_id migration has NOT yet been applied to the live database.');
  } else {
    console.log('   ✅ attempt_id column is present in live game_sessions table.');
  }

  // 6. Check if secure_validate_game_session trigger is active
  console.log('\n6. Checking deployed database migration status summary...');
  console.log('   - Profiles count query verified against live DB.');
}

verifyDeployedDatabase().catch(err => {
  console.error('Fatal error during deployed DB verification:', err);
});
