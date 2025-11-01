'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function signInWithGoogle(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `http://localhost:3000/auth/callback`,
    }
  })

  if (error) {
    console.error('Error signing in with Google:', error)
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return null
}

export async function signOut(prevState?: unknown, formData?: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    return { error: error.message }
  }

  // Don't redirect here when called from client component
  // Let the client handle the redirect
  if (!formData) {
    return { success: true }
  }

  redirect('/login')
}