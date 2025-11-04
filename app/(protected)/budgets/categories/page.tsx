import { Suspense } from "react";
import CategoryTable from "./components/category-table";
import { ICategoryPageParams } from "./types";
import CategoryTableLoading from "./components/category-table/loading";
import Search from "./components/search";
import SearchLoading from "./components/search/loading";
import { CreateCategoryButton } from "./components/add-category";
import { FormSheet } from "@/components/form-sheet";

export default async function BudgetsCategoriesPage({ 
  searchParams 
}: { 
  searchParams: Promise<ICategoryPageParams> 
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 px-2">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Manage your budget categories
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Suspense fallback={<SearchLoading />}>
          <Search searchParams={searchParams} />
        </Suspense>
        <CreateCategoryButton />
      </div>

      <Suspense fallback={<CategoryTableLoading />}>
        <CategoryTable params={searchParams} />
      </Suspense>

      {/* No props needed! */}
      <FormSheet />
    </div>
  );
}