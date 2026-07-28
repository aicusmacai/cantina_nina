import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function updatePassword() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    'e00977b3-eba1-44bb-8bc2-cf264d9e3a8f',
    { password: 'admin123' }
  );
  if (error) {
    console.error(error);
  } else {
    console.log('Password updated to admin123!');
  }
}

updatePassword();
