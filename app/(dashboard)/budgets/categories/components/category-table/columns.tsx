"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ICategory } from "../../types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { useCategoryFormStore } from "../../store"

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
      const openEdit = useCategoryFormStore((state) => state.openEdit)

      const handleEdit = () => {
        openEdit(category) // Instant - no network call!
      }

      const handleDelete = () => {
        alert(`Delete ${category.name}`)
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]