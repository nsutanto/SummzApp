import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indta3BvcWprYWt4YXZvem9xd3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1Nzk5NzIsImV4cCI6MjA3MDE1NTk3Mn0.zX0hMNXTzmabfGkadiDPbaQ2U4APT9xtOWtdd5H-n-Q';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
