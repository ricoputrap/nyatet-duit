"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { ICategory } from "../../types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

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
      const router = useRouter()

      const handleEdit = () => {
        const params = new URLSearchParams(window.location.search)
        params.set('edit', category.id)
        router.push(`?${params.toString()}`)
      }

      const handleDelete = () => {
        alert(`Delete category: ${category.name}`)
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]