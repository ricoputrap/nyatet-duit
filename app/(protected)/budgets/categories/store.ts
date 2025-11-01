import { create } from 'zustand'
import { ICategory } from './types'

interface CategoryFormState {
  isOpen: boolean
  mode: 'create' | 'edit'
  category: ICategory | null
  
  // Actions
  openCreate: () => void
  openEdit: (category: ICategory) => void
  close: () => void
}

export const useCategoryFormStore = create<CategoryFormState>((set) => ({
  isOpen: false,
  mode: 'create',
  category: null,
  
  openCreate: () => set({ 
    isOpen: true, 
    mode: 'create', 
    category: null 
  }),
  
  openEdit: (category) => set({ 
    isOpen: true, 
    mode: 'edit', 
    category 
  }),
  
  close: () => set({ 
    isOpen: false, 
    category: null 
  }),
}))