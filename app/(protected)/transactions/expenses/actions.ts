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

// TODO decrement wallet balance when creating expense
export async function createExpense(data: IExpenseFormData) {
  const supabase = await createClient()
  const user = await getUser()

  const { error } = await supabase
    .from('expenses')
    .insert([{
      name: data.name,
      amount: data.amount,
      date: data.date,
      category_id: data.category_id,
      wallet_id: data.wallet_id,
      user_id: user?.id
    }])

  if (error) {
    console.error("Error creating expense:", error)
    return { error: error.message }
  }

  revalidatePath('/transactions/expenses')
  return { success: true }
}

// TODO adjust wallet balance when updating expense
export async function updateExpense(id: string, data: IExpenseFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('expenses')
    .update({
      name: data.name,
      amount: data.amount,
      date: data.date,
      category_id: data.category_id,
      wallet_id: data.wallet_id,
    })
    .eq('id', id)

  if (error) {
    console.error("Error updating expense:", error)
    return { error: error.message }
  }

  revalidatePath('/transactions/expenses')
  return { success: true }
}

// TODO adjust wallet balance when deleting expense
export async function deleteExpense(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting expense:", error)
    return { error: error.message }
  }

  revalidatePath('/transactions/expenses')
  return { success: true }
}
