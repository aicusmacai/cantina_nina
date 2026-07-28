import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'admin@cantinanina.com';
  const password = 'admin';

  console.log(`Creating admin user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Administrador Geral',
      role: 'admin'
    }
  });

  if (error) {
    console.error('Error creating user:', error.message);
    
    if (error.message.includes('already registered')) {
        console.log('User already exists. Updating role to admin...');
        const { error: updateError } = await supabase.from('usuarios').update({ role: 'admin' }).eq('email', email);
        if(updateError) console.error('Error updating role:', updateError.message);
        else console.log('Role updated successfully.');
    }
    return;
  }

  console.log('User created in auth.users.');
  console.log('The trigger should have created the row in public.usuarios with role admin.');
  
  // Double check
  const { data: userRow } = await supabase.from('usuarios').select('role').eq('email', email).single();
  if (userRow?.role !== 'admin') {
      console.log('Updating role manually to admin just in case...');
      await supabase.from('usuarios').update({ role: 'admin' }).eq('email', email);
  }

  console.log('Done! You can login with: admin (username) and admin (password)');
}

createAdmin();
