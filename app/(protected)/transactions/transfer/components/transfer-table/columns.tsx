"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { ITransfer } from "../../types"
import { useFormSheetStore } from "@/components/form-sheet"
import { DeleteTransferDialog } from "../delete-transfer-dialog"
import TransferForm from "../form"
import { useState } from "react"

export const columns: ColumnDef<ITransfer>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount)
      
      return <span className="text-blue-600 dark:text-blue-400">{formatted}</span>
    },
  },
  {
    accessorKey: "source_wallet_name",
    header: "Source",
  },
  {
    accessorKey: "target_wallet_name",
    header: "Target",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transfer = row.original
      const open = useFormSheetStore((state) => state.open)

      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Transfer", <TransferForm transfer={transfer} />)
      }

      return (
        <div className="flex gap-2">
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
          <DeleteTransferDialog 
            transfer={transfer}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      )
    },
  },
]
