"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { ISavingTransaction, ISavingTransactionPageParams, ISavingTransactionFormData } from "./types"

export async function getSavingTransactions(params: ISavingTransactionPageParams): Promise<ISavingTransaction[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('saving_transactions')
    .select(`
      *,
      wallet:wallets(name),
      saving:savings(name)
    `)
    .eq('user_id', user.id)

  // Search filter
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  // Wallet filter
  if (params.wallet_id) {
    query = query.eq('wallet_id', params.wallet_id)
  }

  // Saving filter
  if (params.saving_id) {
    query = query.eq('saving_id', params.saving_id)
  }

  // Sorting
  if (params.sortKey && params.sortOrder) {
    if (params.sortKey === 'wallet_name') {
      query = query.order('wallet.name', { ascending: params.sortOrder === 'asc' })
    } else if (params.sortKey === 'saving_name') {
      query = query.order('saving.name', { ascending: params.sortOrder === 'asc' })
    } else {
      query = query.order(params.sortKey, { ascending: params.sortOrder === 'asc' })
    }
  } else {
    query = query.order('date', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching saving transactions:', error)
    return []
  }

  return data.map((transaction: any) => ({
    id: transaction.id,
    date: transaction.date,
    name: transaction.name,
    amount: transaction.amount,
    wallet_id: transaction.wallet_id,
    wallet_name: transaction.wallet?.name,
    saving_id: transaction.saving_id,
    saving_name: transaction.saving?.name,
    user_id: transaction.user_id,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  }))
}

export async function createSavingTransaction(data: ISavingTransactionFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Start a transaction-like operation
  // 1. Get current wallet balance
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.wallet_id)
    .eq('user_id', user.id)
    .single()

  if (walletError || !wallet) {
    return { error: 'Wallet not found' }
  }

  // 2. Get current saving collected amount
  const { data: saving, error: savingError } = await supabase
    .from('savings')
    .select('collected')
    .eq('id', data.saving_id)
    .eq('user_id', user.id)
    .single()

  if (savingError || !saving) {
    return { error: 'Saving goal not found' }
  }

  // 3. Check if wallet has enough balance
  if (wallet.balance < data.amount) {
    return { error: 'Insufficient wallet balance' }
  }

  // 4. Create the transaction
  const { error: insertError } = await supabase
    .from('saving_transactions')
    .insert({
      date: data.date,
      name: data.name,
      amount: data.amount,
      wallet_id: data.wallet_id,
      saving_id: data.saving_id,
      user_id: user.id,
    })

  if (insertError) {
    console.error('Error creating saving transaction:', insertError)
    return { error: 'Failed to create saving transaction' }
  }

  // 5. Update wallet balance (decrement)
  const { error: updateWalletError } = await supabase
    .from('wallets')
    .update({ balance: wallet.balance - data.amount })
    .eq('id', data.wallet_id)
    .eq('user_id', user.id)

  if (updateWalletError) {
    console.error('Error updating wallet balance:', updateWalletError)
    return { error: 'Failed to update wallet balance' }
  }

  // 6. Update saving collected amount (increment)
  const { error: updateSavingError } = await supabase
    .from('savings')
    .update({ collected: saving.collected + data.amount })
    .eq('id', data.saving_id)
    .eq('user_id', user.id)

  if (updateSavingError) {
    console.error('Error updating saving collected:', updateSavingError)
    return { error: 'Failed to update saving progress' }
  }

  revalidatePath('/transactions/savings')
  revalidatePath('/savings')
  return { success: true }
}

export async function updateSavingTransaction(id: string, data: ISavingTransactionFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get the original transaction
  const { data: originalTransaction, error: fetchError } = await supabase
    .from('saving_transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !originalTransaction) {
    return { error: 'Transaction not found' }
  }

  // Reverse the original transaction effects
  // 1. Restore wallet balance
  const { data: oldWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', originalTransaction.wallet_id)
    .single()

  if (oldWallet) {
    await supabase
      .from('wallets')
      .update({ balance: oldWallet.balance + originalTransaction.amount })
      .eq('id', originalTransaction.wallet_id)
  }

  // 2. Restore saving collected
  const { data: oldSaving } = await supabase
    .from('savings')
    .select('collected')
    .eq('id', originalTransaction.saving_id)
    .single()

  if (oldSaving) {
    await supabase
      .from('savings')
      .update({ collected: oldSaving.collected - originalTransaction.amount })
      .eq('id', originalTransaction.saving_id)
  }

  // Apply new transaction effects
  // 3. Get new wallet balance
  const { data: newWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.wallet_id)
    .single()

  if (!newWallet || newWallet.balance < data.amount) {
    // Restore if insufficient balance
    if (oldWallet) {
      await supabase
        .from('wallets')
        .update({ balance: oldWallet.balance })
        .eq('id', originalTransaction.wallet_id)
    }
    if (oldSaving) {
      await supabase
        .from('savings')
        .update({ collected: oldSaving.collected })
        .eq('id', originalTransaction.saving_id)
    }
    return { error: 'Insufficient wallet balance' }
  }

  // 4. Update the transaction
  const { error: updateError } = await supabase
    .from('saving_transactions')
    .update({
      date: data.date,
      name: data.name,
      amount: data.amount,
      wallet_id: data.wallet_id,
      saving_id: data.saving_id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Error updating saving transaction:', updateError)
    return { error: 'Failed to update saving transaction' }
  }

  // 5. Update new wallet balance
  await supabase
    .from('wallets')
    .update({ balance: newWallet.balance - data.amount })
    .eq('id', data.wallet_id)

  // 6. Update new saving collected
  const { data: newSaving } = await supabase
    .from('savings')
    .select('collected')
    .eq('id', data.saving_id)
    .single()

  if (newSaving) {
    await supabase
      .from('savings')
      .update({ collected: newSaving.collected + data.amount })
      .eq('id', data.saving_id)
  }

  revalidatePath('/transactions/savings')
  revalidatePath('/savings')
  return { success: true }
}

export async function deleteSavingTransaction(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get the transaction before deleting
  const { data: transaction, error: fetchError } = await supabase
    .from('saving_transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !transaction) {
    return { error: 'Transaction not found' }
  }

  // Delete the transaction
  const { error: deleteError } = await supabase
    .from('saving_transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (deleteError) {
    console.error('Error deleting saving transaction:', deleteError)
    return { error: 'Failed to delete saving transaction' }
  }

  // Restore wallet balance (add back the amount)
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', transaction.wallet_id)
    .single()

  if (wallet) {
    await supabase
      .from('wallets')
      .update({ balance: wallet.balance + transaction.amount })
      .eq('id', transaction.wallet_id)
  }

  // Restore saving collected (subtract the amount)
  const { data: saving } = await supabase
    .from('savings')
    .select('collected')
    .eq('id', transaction.saving_id)
    .single()

  if (saving) {
    await supabase
      .from('savings')
      .update({ collected: saving.collected - transaction.amount })
      .eq('id', transaction.saving_id)
  }

  revalidatePath('/transactions/savings')
  revalidatePath('/savings')
  return { success: true }
}
