import { Search } from "lucide-react"
import { IBudgetPageParams } from "../../types"
import SearchInput from "./search-input";

interface SearchBudgetProps {
  searchParams: Promise<IBudgetPageParams>
}

export async function SearchBudget({ searchParams }: SearchBudgetProps) {
  const params = await searchParams;

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <SearchInput searchValue={params.search || ''} />
    </div>
  )
}
