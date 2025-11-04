import { getUser } from '@/lib/supabase/server';

export async function AuthCheck() {
  // will redirect to /login if not authenticated
  await getUser();

  return null; // This component does not render anything
}