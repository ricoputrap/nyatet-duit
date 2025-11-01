'use client'

import { useActionState } from 'react'
import { LogOut } from 'lucide-react'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { signOut } from '@/app/login/actions'

export function LogoutButton() {
  const [state, formAction, isPending] = useActionState(signOut, null)

  return (
    <form action={formAction}>
      <SidebarMenuButton 
        type="submit"
        disabled={isPending}
        className="w-full"
      >
        <LogOut className="h-4 w-4" />
        <span>{isPending ? 'Signing out...' : 'Logout'}</span>
      </SidebarMenuButton>
    </form>
  )
}
