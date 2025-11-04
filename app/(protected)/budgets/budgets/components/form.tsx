"use client"

import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'

import { 
  SelectField, 
  DateField, 
  NumberField, 
  ActionButtons, 
  useFormSheetStore 
} from "@/components/form-sheet"
import { createBudget, updateBudget } from '../actions'
import { IBudget } from '../types'
import { getCategories } from '../../categories/actions'
import { ICategory } from '../../categories/types'
import { formatDateToYYYYMMDD } from "@/lib/utils"

interface Props {
  budget?: IBudget
}

export default function BudgetForm({ budget }: Props) {
  const close = useFormSheetStore((state) => state.close)
  
  const [categories, setCategories] = useState<ICategory[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(budget?.category_id || '')
  const [startDate, setStartDate] = useState<Date | undefined>(
    budget?.start_date ? new Date(budget.start_date) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    budget?.end_date ? new Date(budget.end_date) : undefined
  )
  const [allocation, setAllocation] = useState<string>(budget?.allocation?.toString() || '')

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories({})
      setCategories(data)
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates')
      return
    }

    if (!selectedCategoryId) {
      toast.error('Please select a category')
      return
    }

    const data = {
      category_id: selectedCategoryId,
      start_date: formatDateToYYYYMMDD(startDate),
      end_date: formatDateToYYYYMMDD(endDate),
      allocation: parseFloat(allocation),
    }

    let result
    if (budget) {
      result = await updateBudget(budget.id, data)
    } else {
      result = await createBudget(data)
    }

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(budget ? 'Budget updated successfully' : 'Budget created successfully')
      close()
    }
  }

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  return (
    <form className="flex flex-col flex-1 px-4 pb-4" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-6">
        <SelectField
          id="category_id"
          title="Category"
          value={selectedCategoryId}
          onValueChange={setSelectedCategoryId}
          options={categoryOptions}
          placeholder="Select a category"
          required
        />

        <DateField
          id="start_date"
          title="Start Date"
          date={startDate}
          onDateChange={setStartDate}
          placeholder="Select start date"
          disabledDates={(date) => {
            if (endDate) {
              return date > endDate
            }
            return false
          }}
        />

        <DateField
          id="end_date"
          title="End Date"
          date={endDate}
          onDateChange={setEndDate}
          placeholder="Select end date"
          disabledDates={(date) => {
            if (startDate) {
              return date < startDate
            }
            return false
          }}
        />

        <NumberField
          id="allocation"
          title="Allocation Amount"
          value={allocation}
          onChange={setAllocation}
          placeholder="0.00"
          required
        />
      </div>

      <ActionButtons isEdit={!!budget} close={close} />
    </form>
  )
}
