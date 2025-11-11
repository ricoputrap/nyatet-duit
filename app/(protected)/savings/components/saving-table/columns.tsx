"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from "lucide-react"
import { ISaving } from "../../types"
import { useFormSheetStore } from "@/components/form-sheet"
import { DeleteSavingDialog } from "../delete-saving-dialog"
import SavingForm from "../form"
import { useState } from "react"

export const columns: ColumnDef<ISaving>[] = [
  {
    accessorKey: "name",
    header: "Goal",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    },
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("target"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "collected",
    header: "Collected",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("collected"))
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
    cell: ({ row }) => {
      const target = parseFloat(row.getValue("target"))
      const collected = parseFloat(row.getValue("collected"))
      const remaining = target - collected
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(remaining)
      return <div>{formatted}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const saving = row.original
      const open = useFormSheetStore((state) => state.open)
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

      const handleEdit = () => {
        open("Edit Saving", <SavingForm saving={saving} />)
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
          <DeleteSavingDialog 
            saving={saving}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </div>
      )
    },
  },
]
