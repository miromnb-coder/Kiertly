import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvdlpnerjslcjavrgzes.supabase.co';
const supabasePublishableKey = 'sb_publishable_ZYe-RUR3JJA_6yM8c-E4Ug_z2FoG5E2';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
