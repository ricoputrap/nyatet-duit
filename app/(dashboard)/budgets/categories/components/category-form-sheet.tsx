"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { ICategoryPageParams } from "../types"
import { use, useEffect, useState } from "react"
import { getCategoryById } from "../actions"

interface CategoryFormSheetProps {
  searchParams: Promise<ICategoryPageParams>
}

export function CategoryFormSheet({ searchParams }: CategoryFormSheetProps) {
  const params = use(searchParams)
  const router = useRouter()
  const [category, setCategory] = useState<any>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const editId = params.edit
  const isOpen = !!editId
  const isEdit = !!category

  useEffect(() => {
    async function fetchCategory() {
      if (editId) {
        setIsLoading(true)
        const category = await getCategoryById(editId)
        setCategory(category)
        setIsLoading(false)
      } else {
        setCategory(undefined)
      }
    }
    fetchCategory()
  }, [editId, params])

  const handleClose = () => {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.delete('edit')
    router.replace(`?${urlParams.toString()}`)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    // TODO: Implement create/update logic with server action
    console.log('Form submitted:', { name, isEdit, categoryId: category?.id })
    
    handleClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl">
            {isEdit ? 'Edit Category' : 'Create Category'}
          </SheetTitle>
        </SheetHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Category Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={category?.name}
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
                onClick={handleClose}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
