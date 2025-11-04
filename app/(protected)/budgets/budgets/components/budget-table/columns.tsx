"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IBudget } from "../../types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useFormSheetStore } from "@/components/form-sheet"
import BudgetForm from "../form"
import { useState } from "react"
import { DeleteBudgetDialog } from "../delete-budget-dialog"

export const columns: ColumnDef<IBudget>[] = [
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("category_name")}</div>
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("start_date"))
      return <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("end_date"))
      return <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
    },
  },
  {
    accessorKey: "allocation",
    header: "Allocation",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("allocation"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: "remaining",
    header: "Remaining",
    cell: ({ row }) => {
      const allocation = parseFloat(row.getValue("allocation"))
      const spent = row.original.spent || 0
      const remaining = allocation - spent
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(remaining)
      
      const textColor = remaining < 0 ? "text-red-600" : remaining < allocation * 0.2 ? "text-yellow-600" : "text-green-600"
      
      return <div className={`font-medium ${textColor}`}>{formatted}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const budget = row.original
      const open = useFormSheetStore((state) => state.open)
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Budget", <BudgetForm budget={budget} />)
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <DeleteBudgetDialog
            budget={budget}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      )
    },
  },
]
