export interface IBudget {
  id: string
  category_id: string
  category_name?: string
  start_date: string
  end_date: string
  allocation: number
  spent?: number
  user_id: string
  created_at?: string
  updated_at?: string
}

export interface IBudgetPageParams {
  search?: string
  sortKey?: 'category_name' | 'start_date' | 'end_date' | 'allocation'
  sortOrder?: 'asc' | 'desc'
  date?: string // For filtering by date/month
}

export interface IBudgetFormData {
  category_id: string
  start_date: string
  end_date: string
  allocation: number
}
