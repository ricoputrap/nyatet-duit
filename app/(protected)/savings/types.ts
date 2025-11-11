export interface ISaving {
  id: string
  name: string
  target: number
  collected: number
  user_id: string
  created_at: string
  updated_at?: string
}

export interface ISavingPageParams {
  search?: string
  sortKey?: 'name' | 'target' | 'collected'
  sortOrder?: 'asc' | 'desc'
}

export interface ISavingFormData {
  name: string
  target: number
  collected: number
}
