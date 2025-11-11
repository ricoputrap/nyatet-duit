"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { 
  TextField,
  NumberField,
  SelectField,
  DateField,
  ActionButtons,
  useFormSheetStore
} from "@/components/form-sheet"
import { formatDateToYYYYMMDD } from "@/lib/utils"
import { getWallets } from '@/app/(protected)/wallets/actions'
import { IWallet } from '@/app/(protected)/wallets/types'
import { createTransfer, updateTransfer } from '../actions'
import { ITransfer } from '../types'

interface Props {
  transfer?: ITransfer
}

export default function TransferForm({ transfer }: Props) {
  const close = useFormSheetStore((state) => state.close)
  
  const [wallets, setWallets] = useState<IWallet[]>([])
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState<Date | undefined>(
    transfer?.date ? new Date(transfer.date) : new Date()
  )
  const [selectedSourceWalletId, setSelectedSourceWalletId] = useState(transfer?.source_wallet_id || '')
  const [selectedTargetWalletId, setSelectedTargetWalletId] = useState(transfer?.target_wallet_id || '')

  useEffect(() => {
    const fetchData = async () => {
      const walletsData = await getWallets({})
      setWallets(walletsData)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const name = (formData.get('name') as string) || ''

    if (!date) {
      toast.error('Please select a date')
      return
    }

    if (!selectedSourceWalletId) {
      toast.error('Please select a source wallet')
      return
    }

    if (!selectedTargetWalletId) {
      toast.error('Please select a target wallet')
      return
    }

    if (selectedSourceWalletId === selectedTargetWalletId) {
      toast.error('Source and target wallets must be different')
      return
    }

    if (!name.trim()) {
      toast.error('Please enter a transfer name')
      return
    }

    const data = {
      name: name.trim(),
      amount: parseFloat(amount),
      date: formatDateToYYYYMMDD(date),
      source_wallet_id: selectedSourceWalletId,
      target_wallet_id: selectedTargetWalletId,
    }

    let result
    if (transfer) {
      result = await updateTransfer(transfer.id, data)
    } else {
      result = await createTransfer(data)
    }

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(transfer ? 'Transfer updated successfully' : 'Transfer created successfully')
      close()
    }
  }

  const walletOptions = wallets.map(wallet => ({
    value: wallet.id,
    label: wallet.name
  }))

  return (
    <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-6">
        <DateField
          id="date"
          title="Date"
          date={date}
          onDateChange={setDate}
          placeholder="Select date"
        />

        <TextField
          id="name"
          title="Transfer Name"
          defaultValue={transfer?.name || ''}
          placeholder="Enter transfer name"
          required
        />

        <NumberField
          id="amount"
          title="Amount"
          value={amount}
          onChange={setAmount}
          placeholder="0"
          required
        />

        <SelectField
          id="source_wallet_id"
          title="Source Wallet"
          value={selectedSourceWalletId}
          onValueChange={setSelectedSourceWalletId}
          options={walletOptions}
          placeholder="Select source wallet"
          required
        />

        <SelectField
          id="target_wallet_id"
          title="Target Wallet"
          value={selectedTargetWalletId}
          onValueChange={setSelectedTargetWalletId}
          options={walletOptions}
          placeholder="Select target wallet"
          required
        />
      </div>

      <ActionButtons isEdit={!!transfer} close={close} />
    </form>
  )
}
