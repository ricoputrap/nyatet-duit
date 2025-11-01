"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBudgetFormStore } from "../store"
import { createBudget, updateBudget } from "../actions"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { getCategories } from "../../categories/actions"
import { ICategory } from "../../categories/types"

export function BudgetFormSheet() {
  const { isOpen, mode, budget, close } = useBudgetFormStore()
  const isEdit = mode === 'edit'
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories({})
      setCategories(data)
    }
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      category_id: formData.get('category_id') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      allocation: parseFloat(formData.get('allocation') as string),
    }

    let result
    if (isEdit && budget) {
      result = await updateBudget(budget.id, data)
    } else {
      result = await createBudget(data)
    }

    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(isEdit ? 'Budget updated successfully' : 'Budget created successfully')
      close()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl">
            {isEdit ? 'Edit Budget' : 'Create Budget'}
          </SheetTitle>
        </SheetHeader>
        
        <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-sm font-medium">
                Category
              </Label>
              <select
                id="category_id"
                name="category_id"
                defaultValue={budget?.category_id || ''}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-medium">
                Start Date
              </Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={budget?.start_date || ''}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-medium">
                End Date
              </Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                defaultValue={budget?.end_date || ''}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocation" className="text-sm font-medium">
                Allocation Amount
              </Label>
              <Input
                id="allocation"
                name="allocation"
                type="number"
                step="0.01"
                min="0"
                defaultValue={budget?.allocation || ''}
                placeholder="0.00"
                className="h-11"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 h-11 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={close}
              className="flex-1 h-11"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
