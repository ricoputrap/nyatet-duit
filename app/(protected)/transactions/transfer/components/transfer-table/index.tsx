import { getTransfers } from "../../actions"
import type { ITransferPageParams } from "../../types"
import { columns } from "./columns"
import { DataTable } from "./data-table"

interface Props {
  params: Promise<ITransferPageParams>
}

export default async function TransferTable({ params }: Props) {
  const searchParams = await params
  const transfers = await getTransfers(searchParams)

  return (
    <DataTable
      columns={columns}
      data={transfers}
    />
  )
}
