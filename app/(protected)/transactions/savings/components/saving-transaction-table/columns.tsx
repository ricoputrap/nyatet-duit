"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { ISavingTransaction } from "../../types"
import { useFormSheetStore } from "@/components/form-sheet"
import { DeleteSavingTransactionDialog } from "../delete-saving-transaction-dialog"
import SavingTransactionForm from "../form"
import { useState } from "react"

export const columns: ColumnDef<ISavingTransaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div>{date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
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
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "saving_name",
    header: "Goal",
    cell: ({ row }) => {
      return <div>{row.getValue("saving_name")}</div>
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
      const transaction = row.original
      const open = useFormSheetStore((state) => state.open)
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Saving Transaction", <SavingTransactionForm transaction={transaction} />)
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
            <Trash className="h-4 w-4" />
          </Button>
          <DeleteSavingTransactionDialog 
            transaction={transaction}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      )
    },
  },
]
