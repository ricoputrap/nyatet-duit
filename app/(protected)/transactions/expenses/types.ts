export interface IExpense {
  id: string
  name: string
  amount: number
  date: string
  category_id: string
  category_name?: string
  wallet_id: string
  wallet_name?: string
  user_id: string
  created_at: string
  updated_at?: string
}

export interface IExpensePageParams {
  search?: string
  category_id?: string
  wallet_id?: string
  sortKey?: 'date' | 'name' | 'amount' | 'category_name' | 'wallet_name'
  sortOrder?: 'asc' | 'desc'
}

export interface IExpenseFormData {
  name: string
  amount: number
  date: string
  category_id: string
  wallet_id: string
}
