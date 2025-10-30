"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCategoryFormStore } from "../store"
import { createCategory, updateCategory } from "../actions"

export function CategoryFormSheet() {
  const { isOpen, mode, category, close } = useCategoryFormStore()
  const isEdit = mode === 'edit'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    if (isEdit) {
      await updateCategory(category!.id, name);
    } else {
      await createCategory(name);
    }
    
    close()
  }

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl">
            {isEdit ? 'Edit Category' : 'Create Category'}
          </SheetTitle>
        </SheetHeader>
        
        <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Category Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={category?.name || ''}
                placeholder="Enter category name..."
                className="h-11"
                required
                autoFocus
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 h-11 font-medium"
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={close}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}