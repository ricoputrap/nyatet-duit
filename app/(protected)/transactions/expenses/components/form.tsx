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
import { formatDateToYYYYMMDD } from "@/lib/utils"
import { getCategories } from '@/app/(protected)/budgets/categories/actions'
import { ICategory } from '@/app/(protected)/budgets/categories/types'
import { getWallets } from '@/app/(protected)/wallets/actions'
import { IWallet } from '@/app/(protected)/wallets/types'
import { createExpense, updateExpense } from '../actions'
import { IExpense } from '../types'

interface Props {
  expense?: IExpense
}

export default function ExpenseForm({ expense }: Props) {
  const close = useFormSheetStore((state) => state.close)
  
  const [categories, setCategories] = useState<ICategory[]>([])
  const [wallets, setWallets] = useState<IWallet[]>([])
  const [amount, setAmount] = useState<string>(expense?.amount?.toString() || '')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(expense?.category_id || '')
  const [selectedWalletId, setSelectedWalletId] = useState<string>(expense?.wallet_id || '')
  const [date, setDate] = useState<Date | undefined>(
    expense?.date ? new Date(expense.date) : new Date()
  )

  useEffect(() => {
    const loadData = async () => {
      const [categoriesData, walletsData] = await Promise.all([
        getCategories({}),
        getWallets({})
      ])
      setCategories(categoriesData)
      setWallets(walletsData)
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    if (!date) {
      toast.error('Please select a date')
      return
    }

    if (!selectedCategoryId) {
      toast.error('Please select a category')
      return
    }

    if (!selectedWalletId) {
      toast.error('Please select a wallet')
      return
    }

    if (!name.trim()) {
      toast.error('Please enter an expense name')
      return
    }

    const data = {
      name: name.trim(),
      amount: parseFloat(amount),
      date: formatDateToYYYYMMDD(date),
      category_id: selectedCategoryId,
      wallet_id: selectedWalletId,
    }

    let result
    if (expense) {
      result = await updateExpense(expense.id, data)
    } else {
      result = await createExpense(data)
    }

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(expense ? 'Expense updated successfully' : 'Expense created successfully')
      close()
    }
  }

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

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
          title="Expense Name"
          defaultValue={expense?.name || ''}
          placeholder="Enter expense name"
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
          id="category_id"
          title="Category"
          value={selectedCategoryId}
          onValueChange={setSelectedCategoryId}
          options={categoryOptions}
          placeholder="Select a category"
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

      <ActionButtons isEdit={!!expense} close={close} />
    </form>
  )
}
