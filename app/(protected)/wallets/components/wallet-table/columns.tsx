"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useFormSheetStore } from "@/components/form-sheet"

import WalletForm from "../form"
import { DeleteWalletDialog } from "../delete-wallet-dialog"
import { IWallet } from "../../types"

export const columns: ColumnDef<IWallet>[] = [
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
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right px-3">Actions</div>,
    size: 100,
    enableResizing: false,
    cell: ({ row }) => {
      const wallet = row.original
      const open = useFormSheetStore((state) => state.open)
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Wallet", <WalletForm wallet={wallet} />)
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

          <DeleteWalletDialog
            wallet={wallet}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )
    },
  },
]
