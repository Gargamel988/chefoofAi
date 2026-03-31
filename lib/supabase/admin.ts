import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin Client
 * WARNING: Use ONLY for server-side operations (webhooks, background tasks).
 * Bypasses Row Level Security (RLS).
 */
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
