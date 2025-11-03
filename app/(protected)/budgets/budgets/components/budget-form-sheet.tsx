"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBudgetFormStore } from "../store"
import { createBudget, updateBudget } from "../actions"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { getCategories } from "../../categories/actions"
import { ICategory } from "../../categories/types"

export function BudgetFormSheet() {
  const { isOpen, mode, budget, close } = useBudgetFormStore()
  const isEdit = mode === 'edit'
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(budget?.category_id || '')
  const [startDate, setStartDate] = useState<Date | undefined>(budget?.start_date ? new Date(budget.start_date) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(budget?.end_date ? new Date(budget.end_date) : undefined)
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)
  const [allocation, setAllocation] = useState<string>(budget?.allocation?.toString() || '')

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories({})
      setCategories(data)
    }
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  useEffect(() => {
    if (budget?.category_id) {
      setSelectedCategoryId(budget.category_id)
    }
    if (budget?.start_date) {
      setStartDate(new Date(budget.start_date))
    }
    if (budget?.end_date) {
      setEndDate(new Date(budget.end_date))
    }
    if (budget?.allocation) {
      setAllocation(budget.allocation.toString())
    }
  }, [budget])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      setIsLoading(false)
      return
    }

    const data = {
      category_id: selectedCategoryId,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      allocation: parseFloat(allocation),
    }

    let result
    if (isEdit && budget) {
      result = await updateBudget(budget.id, data)
    } else {
      result = await createBudget(data)
    }

    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(isEdit ? 'Budget updated successfully' : 'Budget created successfully')
      resetForm()
      close()
    }
  }

  const resetForm = () => {
    setSelectedCategoryId('')
    setStartDate(undefined)
    setEndDate(undefined)
    setAllocation('')
  }

  const handleClose = () => {
    resetForm()
    close()
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl">
            {isEdit ? 'Edit Budget' : 'Create Budget'}
          </SheetTitle>
        </SheetHeader>
        
        <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category_id" className="text-sm font-medium">
                Category
              </Label>
              <Select 
                value={selectedCategoryId} 
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-sm font-medium">
                Start Date
              </Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between font-normal"
                    disabled={isLoading}
                  >
                    {startDate ? startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Select start date"}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      setStartDateOpen(false)
                    }}
                    disabled={(date) => {
                      if (endDate) {
                        return date > endDate
                      }
                      return false
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-sm font-medium">
                End Date
              </Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-11 justify-between font-normal"
                    disabled={isLoading}
                  >
                    {endDate ? endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Select end date"}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      setEndDateOpen(false)
                    }}
                    disabled={(date) => {
                      if (startDate) {
                        return date < startDate
                      }
                      return false
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocation" className="text-sm font-medium">
                Allocation Amount
              </Label>
              <Input
                id="allocation"
                name="allocation"
                type="number"
                step="0.01"
                min="0"
                value={allocation}
                onChange={(e) => setAllocation(e.target.value)}
                placeholder="0.00"
                className="h-11"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              type="submit" 
              className="flex-1 h-11 font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 h-11"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
