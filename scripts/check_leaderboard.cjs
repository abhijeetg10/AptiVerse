require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase.from('global_leaderboard').select('*');
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Leaderboard Data:', data);
    
    // We can delete all users except the ones with real uuids? 
    // Or maybe just truncate the table?
    // Let's just output it first.
  }
}
checkData();
