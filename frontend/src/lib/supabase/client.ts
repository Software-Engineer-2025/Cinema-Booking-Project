// partially from Supabase template code

import { createBrowserClient } from "@supabase/ssr";
import {getRememberCookie} from "@/lib/utils/cookies";

/*
 * Creates browser client to be able to work with the auth session.
 */
export const supabaseClient =
    createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: typeof window !== 'undefined' ? getRememberCookie() === "true" : false,
            detectSessionInUrl: true,
            storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        }
    });
