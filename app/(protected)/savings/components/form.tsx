"use client"

import React, { useState } from 'react'
import { toast } from 'sonner'

import { 
  TextField,
  NumberField,
  ActionButtons,
  useFormSheetStore
} from "@/components/form-sheet"
import { createSaving, updateSaving } from '../actions'
import { ISaving } from '../types'

interface Props {
  saving?: ISaving
}

export default function SavingForm({ saving }: Props) {
  const close = useFormSheetStore((state) => state.close)
  
  const [target, setTarget] = useState<string>(saving?.target?.toString() || '')
  const [collected, setCollected] = useState<string>(saving?.collected?.toString() || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') as string) || ''

    if (!name.trim()) {
      toast.error('Please enter a goal name')
      return
    }

    const data = {
      name: name.trim(),
      target: parseFloat(target),
      collected: parseFloat(collected),
    }

    let result
    if (saving) {
      result = await updateSaving(saving.id, data)
    } else {
      result = await createSaving(data)
    }

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(saving ? 'Saving updated successfully' : 'Saving created successfully')
      close()
    }
  }

  return (
    <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-6">
        <TextField
          id="name"
          title="Goal Name"
          defaultValue={saving?.name || ''}
          placeholder="Enter goal name"
          required
        />

        <NumberField
          id="target"
          title="Target Amount"
          value={target}
          onChange={setTarget}
          placeholder="0"
          required
        />

        <NumberField
          id="collected"
          title="Collected Amount"
          value={collected}
          onChange={setCollected}
          placeholder="0"
          required
        />
      </div>

      <ActionButtons isEdit={!!saving} close={close} />
    </form>
  )
}
