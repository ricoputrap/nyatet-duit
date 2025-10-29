import { Suspense } from "react";
import CategoryTable from "./components/category-table";
import { ICategoryPageParams } from "./types";
import CategoryTableLoading from "./components/category-table/loading";

export default async function BudgetsCategoriesPage({ searchParams }: { searchParams: Promise<ICategoryPageParams> }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Manage your budget categories
        </p>
      </div>
      {/* Placeholder for categories */}

      <Suspense fallback={<CategoryTableLoading />}>
        <CategoryTable params={searchParams} />
      </Suspense>
    </div>
  );
}
