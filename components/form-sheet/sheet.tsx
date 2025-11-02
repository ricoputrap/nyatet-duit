"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import useFormSheetStore from "./store"

export default function FormSheet() {
  const { title, isOpen, form, close } = useFormSheetStore()

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl">
            {title}
          </SheetTitle>
        </SheetHeader>

        {/* Form content goes here */}
        {form}
      </SheetContent>
    </Sheet>
  )
}
