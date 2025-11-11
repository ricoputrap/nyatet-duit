export interface ITransfer {
  id: string
  name: string
  amount: number
  date: string
  source_wallet_id: string
  source_wallet_name?: string
  target_wallet_id: string
  target_wallet_name?: string
  user_id: string
  created_at: string
  updated_at?: string
}

export interface ITransferPageParams {
  search?: string
  source_wallet_id?: string
  target_wallet_id?: string
  sortKey?: 'date' | 'name' | 'amount' | 'source_wallet_name' | 'target_wallet_name'
  sortOrder?: 'asc' | 'desc'
}

export interface ITransferFormData {
  name: string
  amount: number
  date: string
  source_wallet_id: string
  target_wallet_id: string
}
