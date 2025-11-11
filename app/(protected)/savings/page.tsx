import BasePage from "@/templates/base-page"
import { ISavingPageParams } from "./types"
import AddSaving from "./components/add-saving"
import SavingTable from "./components/saving-table"
import SavingTableLoading from "./components/saving-table/loading"

interface PageProps {
  searchParams: Promise<ISavingPageParams>
}

export default function SavingsPage({ searchParams }: PageProps) {
  return (
    <BasePage
      title="Savings"
      description="Track and manage your saving goals"
      searchParams={searchParams}
      searchPlaceholder="Search goal..."
      createButton={<AddSaving />}
      tableComponent={<SavingTable params={searchParams} />}
      tableLoadingComponent={<SavingTableLoading />}
    />
  )
}
