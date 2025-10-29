"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { ICategory } from "../../types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export const columns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    size: 100,
    cell: ({ row }) => {
      const category = row.original

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert(`Edit category: ${category.name}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert(`Delete category: ${category.name}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]