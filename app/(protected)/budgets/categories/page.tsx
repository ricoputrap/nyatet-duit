import CategoryTable from "./components/category-table"
import { ICategoryPageParams } from "./types"
import CategoryTableLoading from "./components/category-table/loading"
import { CreateCategoryButton } from "./components/add-category"
import BasePage from "@/templates/base-page"

export default async function BudgetsCategoriesPage({ 
  searchParams 
}: { 
  searchParams: Promise<ICategoryPageParams> 
}) {
  return (
    <BasePage
      title="Categories"
      description="Manage your budget categories"
      searchParams={searchParams}
      searchPlaceholder="Search category name..."
      createButton={<CreateCategoryButton />}
      tableComponent={<CategoryTable params={searchParams} />}
      tableLoadingComponent={<CategoryTableLoading />}
    />
  )
}