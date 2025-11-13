'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { signOut } from '@/app/login/actions'

export function LogoutMenuItem() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
      router.push('/login')
      router.refresh()
    })
  }

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      disabled={isPending}
    >
      <LogOut className="h-4 w-4" />
      {isPending ? 'Signing out...' : 'Logout'}
    </DropdownMenuItem>
  )
}
