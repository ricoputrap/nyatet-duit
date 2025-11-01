import { create } from 'zustand'
import { IBudget } from './types'

interface BudgetFormState {
  isOpen: boolean
  mode: 'create' | 'edit'
  budget: IBudget | null
  
  // Actions
  openCreate: () => void
  openEdit: (budget: IBudget) => void
  close: () => void
}

export const useBudgetFormStore = create<BudgetFormState>((set) => ({
  isOpen: false,
  mode: 'create',
  budget: null,
  
  openCreate: () => set({ 
    isOpen: true, 
    mode: 'create', 
    budget: null 
  }),
  
  openEdit: (budget) => set({ 
    isOpen: true, 
    mode: 'edit', 
    budget 
  }),
  
  close: () => set({ 
    isOpen: false, 
    mode: 'create', 
    budget: null 
  }),
}))
