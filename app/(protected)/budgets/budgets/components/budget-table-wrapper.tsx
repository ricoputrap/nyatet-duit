import { use } from "react"
import { getBudgets } from "../actions"
import { BudgetDataTable, columns } from "./budget-table"
import { IBudgetPageParams } from "../types"

interface BudgetTableWrapperProps {
  searchParams: Promise<IBudgetPageParams>
}

export async function BudgetTableWrapper({ searchParams }: BudgetTableWrapperProps) {
  const params = await searchParams;
  const budgets = await getBudgets(params)

  return (
    <BudgetDataTable
      columns={columns}
      data={budgets}
      sortKey={params.sortKey}
      sortOrder={params.sortOrder}
    />
  )
}
