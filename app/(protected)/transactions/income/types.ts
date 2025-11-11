export interface IIncome {
  id: string
  name: string
  amount: number
  date: string
  wallet_id: string
  wallet_name?: string
  user_id: string
  created_at: string
  updated_at?: string
}

export interface IIncomePageParams {
  search?: string
  wallet_id?: string
  sortKey?: 'date' | 'name' | 'amount' | 'wallet_name'
  sortOrder?: 'asc' | 'desc'
}

export interface IIncomeFormData {
  name: string
  amount: number
  date: string
  wallet_id: string
}
