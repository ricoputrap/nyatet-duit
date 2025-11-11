"use server"

import { createClient, getUser } from '@/lib/supabase/server'
import { IIncome, IIncomePageParams, IIncomeFormData } from "./types"
import { revalidatePath } from 'next/cache'

export async function getIncomes(params: IIncomePageParams): Promise<IIncome[]> {
  const supabase = await createClient()
  const { 
    search = "", 
    wallet_id,
    sortKey = "date", 
    sortOrder = "desc"
  } = params

  const user = await getUser()

  let query = supabase
    .from("income")
    .select(`
      id,
      name,
      amount,
      date,
      wallet_id,
      user_id,
      created_at,
      wallets (
        name
      )
    `)
    .eq("user_id", user?.id)

  // Filter by wallet if provided
  if (wallet_id) {
    query = query.eq("wallet_id", wallet_id)
  }

  const { data: incomes, error } = await query
    .order(sortKey, { ascending: sortOrder === 'asc' })

  if (error) {
    console.error("Error fetching incomes:", error)
    return []
  }

  // Transform the data to include wallet_name
  const transformedIncomes = incomes?.map((income: any) => ({
    id: income.id,
    name: income.name,
    amount: income.amount,
    date: income.date,
    wallet_id: income.wallet_id,
    wallet_name: income.wallets?.name || '',
    user_id: income.user_id,
    created_at: income.created_at,
  })) || []

  // Filter by search (income name) on client side after join
  if (search) {
    return transformedIncomes.filter((income: IIncome) =>
      income.name?.toLowerCase().includes(search.toLowerCase())
    )
  }

  return transformedIncomes
}

export async function createIncome(data: IIncomeFormData) {
  const supabase = await createClient()
  const user = await getUser()

  // Insert income record
  const { error: incomeError } = await supabase
    .from('income')
    .insert([{
      name: data.name,
      amount: data.amount,
      date: data.date,
      wallet_id: data.wallet_id,
      user_id: user?.id
    }])

  if (incomeError) {
    console.error("Error creating income:", incomeError)
    return { error: incomeError.message }
  }

  // Increment wallet balance
  const { data: wallet, error: walletFetchError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.wallet_id)
    .single()

  if (walletFetchError) {
    console.error("Error fetching wallet:", walletFetchError)
    return { error: "Failed to fetch wallet balance" }
  }

  const newBalance = wallet.balance + data.amount

  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', data.wallet_id)

  if (walletUpdateError) {
    console.error("Error updating wallet balance:", walletUpdateError)
    return { error: "Failed to update wallet balance" }
  }

  revalidatePath('/transactions/income')
  revalidatePath('/wallets')
  return { success: true }
}

export async function updateIncome(id: string, data: IIncomeFormData) {
  const supabase = await createClient()

  // Get the old income data first
  const { data: oldIncome, error: fetchError } = await supabase
    .from('income')
    .select('amount, wallet_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error("Error fetching old income:", fetchError)
    return { error: "Failed to fetch income data" }
  }

  // Update the income
  const { error: updateError } = await supabase
    .from('income')
    .update({
      name: data.name,
      amount: data.amount,
      date: data.date,
      wallet_id: data.wallet_id,
    })
    .eq('id', id)

  if (updateError) {
    console.error("Error updating income:", updateError)
    return { error: updateError.message }
  }

  // If wallet changed, restore old wallet balance and add to new wallet
  if (oldIncome.wallet_id !== data.wallet_id) {
    // Restore old wallet balance (subtract old income)
    const { data: oldWallet, error: oldWalletFetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', oldIncome.wallet_id)
      .single()

    if (!oldWalletFetchError && oldWallet) {
      await supabase
        .from('wallets')
        .update({ balance: oldWallet.balance - oldIncome.amount })
        .eq('id', oldIncome.wallet_id)
    }

    // Add to new wallet
    const { data: newWallet, error: newWalletFetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', data.wallet_id)
      .single()

    if (!newWalletFetchError && newWallet) {
      await supabase
        .from('wallets')
        .update({ balance: newWallet.balance + data.amount })
        .eq('id', data.wallet_id)
    }
  } else {
    // Same wallet, adjust balance by the difference
    const difference = data.amount - oldIncome.amount

    if (difference !== 0) {
      const { data: wallet, error: walletFetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', data.wallet_id)
        .single()

      if (!walletFetchError && wallet) {
        await supabase
          .from('wallets')
          .update({ balance: wallet.balance + difference })
          .eq('id', data.wallet_id)
      }
    }
  }

  revalidatePath('/transactions/income')
  revalidatePath('/wallets')
  return { success: true }
}

export async function deleteIncome(id: string) {
  const supabase = await createClient()

  // Get the income data before deleting
  const { data: income, error: fetchError } = await supabase
    .from('income')
    .select('amount, wallet_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error("Error fetching income:", fetchError)
    return { error: "Failed to fetch income data" }
  }

  // Delete the income
  const { error: deleteError } = await supabase
    .from('income')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error("Error deleting income:", deleteError)
    return { error: deleteError.message }
  }

  // Restore wallet balance (subtract the income amount)
  const { data: wallet, error: walletFetchError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', income.wallet_id)
    .single()

  if (walletFetchError) {
    console.error("Error fetching wallet:", walletFetchError)
    return { error: "Failed to fetch wallet balance" }
  }

  const newBalance = wallet.balance - income.amount

  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', income.wallet_id)

  if (walletUpdateError) {
    console.error("Error updating wallet balance:", walletUpdateError)
    return { error: "Failed to update wallet balance" }
  }

  revalidatePath('/transactions/income')
  revalidatePath('/wallets')
  return { success: true }
}
