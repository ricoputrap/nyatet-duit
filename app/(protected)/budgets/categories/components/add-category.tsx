"use client"

import React from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useFormSheetStore from "@/components/form-sheet/store"

import { createCategory } from "../actions"


export function CreateCategoryButton() {
  const { open, close } = useFormSheetStore()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    await createCategory(name);
    toast.success('Category created successfully');

    // Close the form sheet after submission
    close();
  };

  return (
    <Button onClick={() => open("Create Category", (
      <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Category Name
            </Label>
            <Input
              id="name"
              name="name"
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
            Create
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
    ))}>
      <Plus className="h-4 w-4" />
      Add Category
    </Button>
  )
}