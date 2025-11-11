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
import { getSavings } from '@/app/(protected)/savings/actions'
import { ISaving } from '@/app/(protected)/savings/types'
import { createSavingTransaction, updateSavingTransaction } from '../actions'
import { ISavingTransaction } from '../types'

interface Props {
  transaction?: ISavingTransaction
}

export default function SavingTransactionForm({ transaction }: Props) {
  const close = useFormSheetStore((state) => state.close)
  
  const [wallets, setWallets] = useState<IWallet[]>([])
  const [savings, setSavings] = useState<ISaving[]>([])
  const [amount, setAmount] = useState<string>(transaction?.amount?.toString() || '')
  const [date, setDate] = useState<Date | undefined>(
    transaction?.date ? new Date(transaction.date) : new Date()
  )
  const [selectedWalletId, setSelectedWalletId] = useState(transaction?.wallet_id || '')
  const [selectedSavingId, setSelectedSavingId] = useState(transaction?.saving_id || '')

  useEffect(() => {
    const fetchData = async () => {
      const [walletsData, savingsData] = await Promise.all([
        getWallets({}),
        getSavings({})
      ])
      setWallets(walletsData)
      setSavings(savingsData)
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

    if (!selectedWalletId) {
      toast.error('Please select a wallet')
      return
    }

    if (!selectedSavingId) {
      toast.error('Please select a saving goal')
      return
    }

    if (!name.trim()) {
      toast.error('Please enter a transaction name')
      return
    }

    const data = {
      date: formatDateToYYYYMMDD(date),
      name: name.trim(),
      amount: parseFloat(amount),
      wallet_id: selectedWalletId,
      saving_id: selectedSavingId,
    }

    let result
    if (transaction) {
      result = await updateSavingTransaction(transaction.id, data)
    } else {
      result = await createSavingTransaction(data)
    }

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(transaction ? 'Saving transaction updated successfully' : 'Saving transaction created successfully')
      close()
    }
  }

  const walletOptions = wallets.map(wallet => ({
    value: wallet.id,
    label: wallet.name
  }))

  const savingOptions = savings.map(saving => ({
    value: saving.id,
    label: saving.name
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
          title="Transaction Name"
          defaultValue={transaction?.name || ''}
          placeholder="Enter transaction name"
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

        <SelectField
          id="saving_id"
          title="Saving Goal"
          value={selectedSavingId}
          onValueChange={setSelectedSavingId}
          options={savingOptions}
          placeholder="Select a saving goal"
          required
        />
      </div>

      <ActionButtons isEdit={!!transaction} close={close} />
    </form>
  )
}
