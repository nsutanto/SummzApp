import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://qxtrzmpdkcvjexzfqxqe.supabase.co';
const supabaseKey = 'sb_publishable_lOaBEXl9K1kTcNFBRGSuhA_v4iP_c-I';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
