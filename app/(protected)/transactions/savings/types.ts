export interface ISavingTransaction {
  id: string
  date: string
  name: string
  amount: number
  wallet_id: string
  wallet_name?: string
  saving_id: string
  saving_name?: string
  user_id: string
  created_at: string
  updated_at?: string
}

export interface ISavingTransactionPageParams {
  search?: string
  wallet_id?: string
  saving_id?: string
  sortKey?: 'date' | 'name' | 'amount' | 'wallet_name' | 'saving_name'
  sortOrder?: 'asc' | 'desc'
}

export interface ISavingTransactionFormData {
  date: string
  name: string
  amount: number
  wallet_id: string
  saving_id: string
}
