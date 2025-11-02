import { create } from 'zustand'

export interface FormSheetState {
  title: string,
  isOpen: boolean,
  form: React.ReactNode | null,

  // Actions
  open: (title: string, form: React.ReactNode) => void
  close: () => void
}

const useFormSheetStore = create<FormSheetState>((set) => ({
  title: '',
  isOpen: false,
  form: null,

  open: (title, form) => set({
    title,
    isOpen: true, 
    form,
  }),

  close: () => set({ 
    title: '',
    isOpen: false, 
    form: null,
  }),
}));

export default useFormSheetStore;