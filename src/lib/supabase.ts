import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const resolvedCookies = await cookieStore
          return resolvedCookies.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const resolvedCookies = await cookieStore
            resolvedCookies.set({ name, value, ...options })
          } catch (error) {
            // Error is typical when setting cookies from server action/component boundaries.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            const resolvedCookies = await cookieStore
            resolvedCookies.set({ name, value: '', ...options })
          } catch (error) {
            // Error handler
          }
        },
      },
    }
  )
}

// Client-side component Supabase instance
export const createClientBrowser = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Admin client for bypass RLS in backend services (AI operations)
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
export const getServiceSupabase = () =>
  createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
