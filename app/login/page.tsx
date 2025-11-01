import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginButton } from './components/login-btn'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/dist/client/components/navigation'

export default async function LoginPage() {

  // Check if user is already logged in & redirect to dashboard if so
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (!error && !!data?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <CardTitle className="text-2xl font-bold">Nyatet Duit</CardTitle>
          <CardDescription>
            Sign in to manage your budget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  )
}