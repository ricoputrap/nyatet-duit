"use client"

import React from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import useFormSheetStore from "@/components/form-sheet/store"

import { createCategory } from "../actions"
import CategoryForm from "./form"


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
    <Button onClick={() => open("Create Category", <CategoryForm />)}>
      <Plus className="h-4 w-4" />
      Add Category
    </Button>
  )
}