'use client'

import { useActionState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/login/actions'

export function LogoutButton() {
  const [state, formAction, isPending] = useActionState(signOut, null)

  return (
    <form action={formAction}>
      <Button 
        type="submit" 
        variant="ghost" 
        size="sm"
        disabled={isPending}
      >
        <LogOut className="h-4 w-4" />
        {isPending ? 'Signing out...' : 'Logout'}
      </Button>
    </form>
  )
}
