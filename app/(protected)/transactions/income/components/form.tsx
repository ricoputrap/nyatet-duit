"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { 
  SelectField, 
  DateField, 
  NumberField, 
  TextField,
  ActionButtons, 
  useFormSheetStore 
} from "@/components/form-sheet"
import { createIncome, updateIncome } from '../actions'
import { IIncome } from '../types'
import { getWallets } from '@/app/(protected)/wallets/actions'
import { IWallet } from '@/app/(protected)/wallets/types'
import { formatDateToYYYYMMDD } from "@/lib/utils"

interface Props {
  income?: IIncome
}

export default function IncomeForm({ income }: Props) {
  const close = useFormSheetStore((state) => state.close)
  
  const [wallets, setWallets] = useState<IWallet[]>([])
  const [amount, setAmount] = useState<string>(income?.amount?.toString() || '')
  const [selectedWalletId, setSelectedWalletId] = useState<string>(income?.wallet_id || '')
  const [date, setDate] = useState<Date | undefined>(
    income?.date ? new Date(income.date) : new Date()
  )

  useEffect(() => {
    const loadWallets = async () => {
      const walletsData = await getWallets({})
      setWallets(walletsData)
    }
    loadWallets()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    
    if (!date) {
      toast.error('Please select a date')
      return
    }

    if (!selectedWalletId) {
      toast.error('Please select a wallet')
      return
    }

    if (!name.trim()) {
      toast.error('Please enter an income name')
      return
    }

    const data = {
      name: name.trim(),
      amount: parseFloat(amount),
      date: formatDateToYYYYMMDD(date),
      wallet_id: selectedWalletId,
    }

    let result
    if (income) {
      result = await updateIncome(income.id, data)
    } else {
      result = await createIncome(data)
    }

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(income ? 'Income updated successfully' : 'Income created successfully')
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
          title="Income Name"
          defaultValue={income?.name || ''}
          placeholder="Enter income name"
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
          id="wallet_id"
          title="Wallet"
          value={selectedWalletId}
          onValueChange={setSelectedWalletId}
          options={walletOptions}
          placeholder="Select a wallet"
          required
        />
      </div>

      <ActionButtons isEdit={!!income} close={close} />
    </form>
  )
}
