export interface IWallet {
  id: string
  name: string
  balance: number
  user_id: string
  created_at: string
  updated_at: string
}

export interface IWalletPageParams {
  search?: string
}
