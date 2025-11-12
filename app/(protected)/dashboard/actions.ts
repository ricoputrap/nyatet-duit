"use server"

import { createClient } from "@/lib/supabase/server"

export interface IDashboardStats {
  totalBalance: number
  totalSavings: number
  monthlyIncome: number
  monthlyExpenses: number
  budgetUsage: Array<{
    category: string
    spent: number
    budget: number
    percentage: number
  }>
  recentTransactions: Array<{
    id: string
    type: 'income' | 'expense' | 'transfer' | 'saving'
    name: string
    amount: number
    date: string
    category?: string
  }>
  savingGoals: Array<{
    id: string
    name: string
    target: number
    collected: number
    percentage: number
  }>
  expensesByCategory: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

export async function getDashboardStats(): Promise<IDashboardStats> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      totalBalance: 0,
      totalSavings: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      budgetUsage: [],
      recentTransactions: [],
      savingGoals: [],
      expensesByCategory: [],
    }
  }

  // Get current month start and end
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

  // Fetch all data in parallel
  const [
    walletsData,
    savingsData,
    incomeData,
    expensesData,
    budgetsData,
    categoriesData,
    recentIncomeData,
    recentExpensesData,
    recentTransfersData,
    recentSavingsData,
  ] = await Promise.all([
    // Total balance from wallets
    supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id),
    
    // Total savings
    supabase
      .from('savings')
      .select('*')
      .eq('user_id', user.id),
    
    // Monthly income
    supabase
      .from('income')
      .select('amount')
      .eq('user_id', user.id)
      .gte('date', monthStart)
      .lte('date', monthEnd),
    
    // Monthly expenses
    supabase
      .from('expenses')
      .select('amount, category_id, category:categories(name)')
      .eq('user_id', user.id)
      .gte('date', monthStart)
      .lte('date', monthEnd),
    
    // Budgets for current month
    supabase
      .from('budgets')
      .select('*, category:categories(name)')
      .eq('user_id', user.id)
      .gte('month', monthStart)
      .lte('month', monthEnd),
    
    // Categories
    supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id),
    
    // Recent income (last 5)
    supabase
      .from('income')
      .select('id, name, amount, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
    
    // Recent expenses (last 5)
    supabase
      .from('expenses')
      .select('id, name, amount, date, category:categories(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
    
    // Recent transfers (last 5)
    supabase
      .from('transfers')
      .select('id, amount, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
    
    // Recent saving transactions (last 5)
    supabase
      .from('saving_transactions')
      .select('id, amount, date, saving:savings(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5),
  ])

  // Calculate total balance
  const totalBalance = walletsData.data?.reduce((sum: number, wallet: any) => sum + (wallet.balance || 0), 0) || 0

  // Calculate total savings
  const totalSavings = savingsData.data?.reduce((sum: number, saving: any) => sum + (saving.collected || 0), 0) || 0

  // Calculate monthly income
  const monthlyIncome = incomeData.data?.reduce((sum: number, income: any) => sum + (income.amount || 0), 0) || 0

  // Calculate monthly expenses
  const monthlyExpenses = expensesData.data?.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0) || 0

  // Calculate budget usage
  const budgetUsage = budgetsData.data?.map((budget: any) => {
    const categoryExpenses = expensesData.data?.filter(
      (expense: any) => expense.category_id === budget.category_id
    ) || []
    const spent = categoryExpenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0)
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0

    return {
      category: budget.category?.name || 'Unknown',
      spent,
      budget: budget.amount,
      percentage: Math.round(percentage),
    }
  }) || []

  // Calculate expenses by category
  const expensesByCategory: { [key: string]: number } = {}
  expensesData.data?.forEach((expense: any) => {
    const categoryName = expense.category?.name || 'Uncategorized'
    expensesByCategory[categoryName] = (expensesByCategory[categoryName] || 0) + expense.amount
  })

  const totalExpensesForPercentage = Object.values(expensesByCategory).reduce((sum: number, amount) => sum + amount, 0)
  const expensesByCategoryArray = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpensesForPercentage > 0 ? Math.round((amount / totalExpensesForPercentage) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5) // Top 5 categories

  // Combine recent transactions
  const recentTransactions = [
    ...(recentIncomeData.data?.map((t: any) => ({
      id: t.id,
      type: 'income' as const,
      name: t.name,
      amount: t.amount,
      date: t.date,
    })) || []),
    ...(recentExpensesData.data?.map((t: any) => ({
      id: t.id,
      type: 'expense' as const,
      name: t.name,
      amount: t.amount,
      date: t.date,
      category: t.category?.name,
    })) || []),
    ...(recentTransfersData.data?.map((t: any) => ({
      id: t.id,
      type: 'transfer' as const,
      name: 'Transfer',
      amount: t.amount,
      date: t.date,
    })) || []),
    ...(recentSavingsData.data?.map((t: any) => ({
      id: t.id,
      type: 'saving' as const,
      name: t.saving?.name || 'Saving',
      amount: t.amount,
      date: t.date,
    })) || []),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10) // Latest 10 transactions

  // Prepare saving goals
  const savingGoals = savingsData.data?.map((saving: any) => ({
    id: saving.id,
    name: saving.name,
    target: saving.target,
    collected: saving.collected,
    percentage: saving.target > 0 ? Math.round((saving.collected / saving.target) * 100) : 0,
  })) || []

  return {
    totalBalance,
    totalSavings,
    monthlyIncome,
    monthlyExpenses,
    budgetUsage,
    recentTransactions,
    savingGoals,
    expensesByCategory: expensesByCategoryArray,
  }
}
