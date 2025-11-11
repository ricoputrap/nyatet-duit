"use server"

import { createClient, getUser } from '@/lib/supabase/server'
import { ITransfer, ITransferPageParams, ITransferFormData } from "./types"
import { revalidatePath } from 'next/cache'

export async function getTransfers(params: ITransferPageParams): Promise<ITransfer[]> {
  const supabase = await createClient()
  const { 
    search = "", 
    source_wallet_id,
    target_wallet_id,
    sortKey = "date", 
    sortOrder = "desc"
  } = params

  const user = await getUser()

  let query = supabase
    .from("transfers")
    .select(`
      id,
      name,
      amount,
      date,
      source_wallet_id,
      target_wallet_id,
      user_id,
      created_at,
      source_wallet:wallets!transfers_source_wallet_id_fkey (
        name
      ),
      target_wallet:wallets!transfers_target_wallet_id_fkey (
        name
      )
    `)
    .eq("user_id", user?.id)

  // Filter by source wallet if provided
  if (source_wallet_id) {
    query = query.eq("source_wallet_id", source_wallet_id)
  }

  // Filter by target wallet if provided
  if (target_wallet_id) {
    query = query.eq("target_wallet_id", target_wallet_id)
  }

  const { data: transfers, error } = await query
    .order(sortKey, { ascending: sortOrder === 'asc' })

  if (error) {
    console.error("Error fetching transfers:", error)
    return []
  }

  // Transform the data to include wallet names
  const transformedTransfers = transfers?.map((transfer: any) => ({
    id: transfer.id,
    name: transfer.name,
    amount: transfer.amount,
    date: transfer.date,
    source_wallet_id: transfer.source_wallet_id,
    source_wallet_name: transfer.source_wallet?.name || '',
    target_wallet_id: transfer.target_wallet_id,
    target_wallet_name: transfer.target_wallet?.name || '',
    user_id: transfer.user_id,
    created_at: transfer.created_at,
  })) || []

  // Filter by search (transfer name) on client side after join
  if (search) {
    return transformedTransfers.filter((transfer: ITransfer) =>
      transfer.name?.toLowerCase().includes(search.toLowerCase())
    )
  }

  return transformedTransfers
}

export async function createTransfer(data: ITransferFormData) {
  const supabase = await createClient()
  const user = await getUser()

  // Validate that source and target wallets are different
  if (data.source_wallet_id === data.target_wallet_id) {
    return { error: "Source and target wallets must be different" }
  }

  // Insert transfer record
  const { error: transferError } = await supabase
    .from('transfers')
    .insert([{
      name: data.name,
      amount: data.amount,
      date: data.date,
      source_wallet_id: data.source_wallet_id,
      target_wallet_id: data.target_wallet_id,
      user_id: user?.id
    }])

  if (transferError) {
    console.error("Error creating transfer:", transferError)
    return { error: transferError.message }
  }

  // Decrement source wallet balance
  const { data: sourceWallet, error: sourceWalletFetchError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.source_wallet_id)
    .single()

  if (sourceWalletFetchError) {
    console.error("Error fetching source wallet:", sourceWalletFetchError)
    return { error: "Failed to fetch source wallet balance" }
  }

  const newSourceBalance = sourceWallet.balance - data.amount

  const { error: sourceWalletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newSourceBalance })
    .eq('id', data.source_wallet_id)

  if (sourceWalletUpdateError) {
    console.error("Error updating source wallet balance:", sourceWalletUpdateError)
    return { error: "Failed to update source wallet balance" }
  }

  // Increment target wallet balance
  const { data: targetWallet, error: targetWalletFetchError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.target_wallet_id)
    .single()

  if (targetWalletFetchError) {
    console.error("Error fetching target wallet:", targetWalletFetchError)
    return { error: "Failed to fetch target wallet balance" }
  }

  const newTargetBalance = targetWallet.balance + data.amount

  const { error: targetWalletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newTargetBalance })
    .eq('id', data.target_wallet_id)

  if (targetWalletUpdateError) {
    console.error("Error updating target wallet balance:", targetWalletUpdateError)
    return { error: "Failed to update target wallet balance" }
  }

  revalidatePath('/transactions/transfer')
  revalidatePath('/wallets')
  return { success: true }
}

export async function updateTransfer(id: string, data: ITransferFormData) {
  const supabase = await createClient()

  // Validate that source and target wallets are different
  if (data.source_wallet_id === data.target_wallet_id) {
    return { error: "Source and target wallets must be different" }
  }

  // Get the old transfer data first
  const { data: oldTransfer, error: fetchError } = await supabase
    .from('transfers')
    .select('amount, source_wallet_id, target_wallet_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error("Error fetching old transfer:", fetchError)
    return { error: "Failed to fetch transfer data" }
  }

  // Update the transfer
  const { error: updateError } = await supabase
    .from('transfers')
    .update({
      name: data.name,
      amount: data.amount,
      date: data.date,
      source_wallet_id: data.source_wallet_id,
      target_wallet_id: data.target_wallet_id,
    })
    .eq('id', id)

  if (updateError) {
    console.error("Error updating transfer:", updateError)
    return { error: updateError.message }
  }

  // Revert old transfer: add back to source, subtract from target
  const { data: oldSourceWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', oldTransfer.source_wallet_id)
    .single()

  if (oldSourceWallet) {
    await supabase
      .from('wallets')
      .update({ balance: oldSourceWallet.balance + oldTransfer.amount })
      .eq('id', oldTransfer.source_wallet_id)
  }

  const { data: oldTargetWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', oldTransfer.target_wallet_id)
    .single()

  if (oldTargetWallet) {
    await supabase
      .from('wallets')
      .update({ balance: oldTargetWallet.balance - oldTransfer.amount })
      .eq('id', oldTransfer.target_wallet_id)
  }

  // Apply new transfer: subtract from source, add to target
  const { data: newSourceWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.source_wallet_id)
    .single()

  if (newSourceWallet) {
    await supabase
      .from('wallets')
      .update({ balance: newSourceWallet.balance - data.amount })
      .eq('id', data.source_wallet_id)
  }

  const { data: newTargetWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.target_wallet_id)
    .single()

  if (newTargetWallet) {
    await supabase
      .from('wallets')
      .update({ balance: newTargetWallet.balance + data.amount })
      .eq('id', data.target_wallet_id)
  }

  revalidatePath('/transactions/transfer')
  revalidatePath('/wallets')
  return { success: true }
}

export async function deleteTransfer(id: string) {
  const supabase = await createClient()

  // Get the transfer data before deleting
  const { data: transfer, error: fetchError } = await supabase
    .from('transfers')
    .select('amount, source_wallet_id, target_wallet_id')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error("Error fetching transfer:", fetchError)
    return { error: "Failed to fetch transfer data" }
  }

  // Delete the transfer
  const { error: deleteError } = await supabase
    .from('transfers')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error("Error deleting transfer:", deleteError)
    return { error: deleteError.message }
  }

  // Revert transfer: add back to source wallet
  const { data: sourceWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', transfer.source_wallet_id)
    .single()

  if (sourceWallet) {
    await supabase
      .from('wallets')
      .update({ balance: sourceWallet.balance + transfer.amount })
      .eq('id', transfer.source_wallet_id)
  }

  // Subtract from target wallet
  const { data: targetWallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', transfer.target_wallet_id)
    .single()

  if (targetWallet) {
    await supabase
      .from('wallets')
      .update({ balance: targetWallet.balance - transfer.amount })
      .eq('id', transfer.target_wallet_id)
  }

  revalidatePath('/transactions/transfer')
  revalidatePath('/wallets')
  return { success: true }
}
