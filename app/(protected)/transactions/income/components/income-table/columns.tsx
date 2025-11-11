"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IIncome } from "../../types"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useFormSheetStore } from "@/components/form-sheet"
import IncomeForm from "../form"
import { useState } from "react"
import { DeleteIncomeDialog } from "../delete-income-dialog"

export const columns: ColumnDef<IIncome>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div className="font-medium text-green-600">{formatted}</div>
    },
  },
  {
    accessorKey: "wallet_name",
    header: "Wallet",
    cell: ({ row }) => {
      return <div>{row.getValue("wallet_name")}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const income = row.original
      const open = useFormSheetStore((state) => state.open)
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Income", <IncomeForm income={income} />)
      }

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteDialogOpen(true)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <DeleteIncomeDialog
            income={income}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      )
    },
  },
]
