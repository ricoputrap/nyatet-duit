"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import useFormSheetStore from "@/components/form-sheet/store"

import CategoryForm from "../form"
import { DeleteCategoryDialog } from "../delete-category-dialog"
import { ICategory } from "../../types"

export const columns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    size: 100,
    cell: ({ row }) => {
      const category = row.original
      const open = useFormSheetStore((state) => state.open)
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Category", <CategoryForm category={category} />)
      }

      const handleDelete = () => {
        setDeleteDialogOpen(true)
      }

      return (
        <>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <DeleteCategoryDialog 
            category={category}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )
    },
  },
]