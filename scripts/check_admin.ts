import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function check() {
  const { data, error } = await supabase.from('usuarios').select('*').eq('email', 'admin@cantinanina.com');
  console.log('Result from usuarios table:');
  console.log(data);
  if (error) console.error(error);
}

check();
