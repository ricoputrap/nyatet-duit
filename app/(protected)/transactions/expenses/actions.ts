"use server"

import { createClient, getUser } from '@/lib/supabase/server'
import { IExpense, IExpensePageParams, IExpenseFormData } from "./types"
import { revalidatePath } from 'next/cache'

export async function getExpenses(params: IExpensePageParams): Promise<IExpense[]> {
  const supabase = await createClient()
  const { 
    search = "", 
    category_id,
    wallet_id,
    sortKey = "date", 
    sortOrder = "desc"
  } = params

  const user = await getUser()

  let query = supabase
    .from("expenses")
    .select(`
      id,
      name,
      amount,
      date,
      category_id,
      wallet_id,
      user_id,
      created_at,
      categories (
        name
      ),
      wallets (
        name
      )
    `)
    .eq("user_id", user?.id)

  // Filter by category if provided
  if (category_id) {
    query = query.eq("category_id", category_id)
  }

  // Filter by wallet if provided
  if (wallet_id) {
    query = query.eq("wallet_id", wallet_id)
  }

  const { data: expenses, error } = await query
    .order(sortKey, { ascending: sortOrder === 'asc' })

  if (error) {
    console.error("Error fetching expenses:", error)
    return []
  }

  // Transform the data to include category_name and wallet_name
  const transformedExpenses = expenses?.map((expense: any) => ({
    id: expense.id,
    name: expense.name,
    amount: expense.amount,
    date: expense.date,
    category_id: expense.category_id,
    category_name: expense.categories?.name || '',
    wallet_id: expense.wallet_id,
    wallet_name: expense.wallets?.name || '',
    user_id: expense.user_id,
    created_at: expense.created_at,
  })) || []

  // Filter by search (expense name) on client side after join
  if (search) {
    return transformedExpenses.filter((expense: IExpense) =>
      expense.name?.toLowerCase().includes(search.toLowerCase())
    )
  }

  return transformedExpenses
}

export async function createExpense(data: IExpenseFormData) {
  const supabase = await createClient()
  const user = await getUser()

  // Start a transaction by inserting expense and updating wallet balance
  const { error: expenseError } = await supabase
    .from('expenses')
    .insert([{
      name: data.name,
      amount: data.amount,
      date: data.date,
      category_id: data.category_id,
      wallet_id: data.wallet_id,
      user_id: user?.id
    }])

  if (expenseError) {
    console.error("Error creating expense:", expenseError)
    return { error: expenseError.message }
  }

  // Decrement wallet balance
  const { data: wallet, error: walletFetchError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', data.wallet_id)
    .single()

  if (walletFetchError) {
    console.error("Error fetching wallet:", walletFetchError)
    return { error: "Failed to fetch wallet balance" }
  }

  const newBalance = wallet.balance - data.amount

  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', data.wallet_id)

  if (walletUpdateError) {
    console.error("Error updating wallet balance:", walletUpdateError)
    return { error: "Failed to update wallet balance" }
  }

  // Update budget spent amount if there's an active budget for this category and date
  const { data: budgets } = await supabase
    .from('budgets')
    .select('id, allocation, spent')
    .eq('category_id', data.category_id)
    .eq('user_id', user?.id)
    .lte('start_date', data.date)
    .gte('end_date', data.date)

  if (budgets && budgets.length > 0) {
    // Update the first matching budget (there should typically be only one)
    const budget = budgets[0]
    const newSpent = (budget.spent || 0) + data.amount

    await supabase
      .from('budgets')
      .update({ spent: newSpent })
      .eq('id', budget.id)
  }

  revalidatePath('/transactions/expenses')
  revalidatePath('/wallets')
  revalidatePath('/budgets/budgets')
  return { success: true }
}

export async function updateExpense(id: string, data: IExpenseFormData) {
  const supabase = await createClient()

  // Get the old expense data first
  const { data: oldExpense, error: fetchError } = await supabase
    .from('expenses')
    .select('amount, wallet_id, category_id, date')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error("Error fetching old expense:", fetchError)
    return { error: "Failed to fetch expense data" }
  }

  // Update the expense
  const { error: updateError } = await supabase
    .from('expenses')
    .update({
      name: data.name,
      amount: data.amount,
      date: data.date,
      category_id: data.category_id,
      wallet_id: data.wallet_id,
    })
    .eq('id', id)

  if (updateError) {
    console.error("Error updating expense:", updateError)
    return { error: updateError.message }
  }

  // Get user for budget queries
  const user = await getUser()

  // If wallet changed, restore old wallet balance and deduct from new wallet
  if (oldExpense.wallet_id !== data.wallet_id) {
    // Restore old wallet balance
    const { data: oldWallet, error: oldWalletFetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', oldExpense.wallet_id)
      .single()

    if (!oldWalletFetchError && oldWallet) {
      await supabase
        .from('wallets')
        .update({ balance: oldWallet.balance + oldExpense.amount })
        .eq('id', oldExpense.wallet_id)
    }

    // Deduct from new wallet
    const { data: newWallet, error: newWalletFetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', data.wallet_id)
      .single()

    if (!newWalletFetchError && newWallet) {
      await supabase
        .from('wallets')
        .update({ balance: newWallet.balance - data.amount })
        .eq('id', data.wallet_id)
    }
  } else {
    // Same wallet, adjust balance by the difference
    const difference = data.amount - oldExpense.amount

    if (difference !== 0) {
      const { data: wallet, error: walletFetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('id', data.wallet_id)
        .single()

      if (!walletFetchError && wallet) {
        await supabase
          .from('wallets')
          .update({ balance: wallet.balance - difference })
          .eq('id', data.wallet_id)
      }
    }
  }

  // Update budget spent amount
  // First, subtract old amount from old budget (if exists)
  const { data: oldBudgets } = await supabase
    .from('budgets')
    .select('id, spent')
    .eq('category_id', oldExpense.category_id)
    .eq('user_id', user?.id)
    .lte('start_date', oldExpense.date)
    .gte('end_date', oldExpense.date)

  if (oldBudgets && oldBudgets.length > 0) {
    const oldBudget = oldBudgets[0]
    const newSpent = Math.max(0, (oldBudget.spent || 0) - oldExpense.amount)
    await supabase
      .from('budgets')
      .update({ spent: newSpent })
      .eq('id', oldBudget.id)
  }

  // Then, add new amount to new budget (if exists)
  const { data: newBudgets } = await supabase
    .from('budgets')
    .select('id, spent')
    .eq('category_id', data.category_id)
    .eq('user_id', user?.id)
    .lte('start_date', data.date)
    .gte('end_date', data.date)

  if (newBudgets && newBudgets.length > 0) {
    const newBudget = newBudgets[0]
    const newSpent = (newBudget.spent || 0) + data.amount
    await supabase
      .from('budgets')
      .update({ spent: newSpent })
      .eq('id', newBudget.id)
  }

  revalidatePath('/transactions/expenses')
  revalidatePath('/wallets')
  revalidatePath('/budgets/budgets')
  return { success: true }
}

export async function deleteExpense(id: string) {
  const supabase = await createClient()
  const user = await getUser()

  // Get the expense data before deleting
  const { data: expense, error: fetchError } = await supabase
    .from('expenses')
    .select('amount, wallet_id, category_id, date')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error("Error fetching expense:", fetchError)
    return { error: "Failed to fetch expense data" }
  }

  // Delete the expense
  const { error: deleteError } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (deleteError) {
    console.error("Error deleting expense:", deleteError)
    return { error: deleteError.message }
  }

  // Restore wallet balance (add back the expense amount)
  const { data: wallet, error: walletFetchError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', expense.wallet_id)
    .single()

  if (walletFetchError) {
    console.error("Error fetching wallet:", walletFetchError)
    return { error: "Failed to fetch wallet balance" }
  }

  const newBalance = wallet.balance + expense.amount

  const { error: walletUpdateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('id', expense.wallet_id)

  if (walletUpdateError) {
    console.error("Error updating wallet balance:", walletUpdateError)
    return { error: "Failed to update wallet balance" }
  }

  // Update budget spent amount (subtract the deleted expense amount)
  const { data: budgets } = await supabase
    .from('budgets')
    .select('id, spent')
    .eq('category_id', expense.category_id)
    .eq('user_id', user?.id)
    .lte('start_date', expense.date)
    .gte('end_date', expense.date)

  if (budgets && budgets.length > 0) {
    const budget = budgets[0]
    const newSpent = Math.max(0, (budget.spent || 0) - expense.amount)
    await supabase
      .from('budgets')
      .update({ spent: newSpent })
      .eq('id', budget.id)
  }

  revalidatePath('/transactions/expenses')
  revalidatePath('/wallets')
  revalidatePath('/budgets/budgets')
  return { success: true }
}
