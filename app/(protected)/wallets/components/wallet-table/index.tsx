import { getWallets } from "../../actions"
import { IWalletPageParams } from "../../types"
import { columns } from "./columns"
import { DataTable } from "./data-table"

interface Props {
  params: Promise<IWalletPageParams>
}

export default async function WalletTable({ params }: Props) {
  const { search } = await params
  const wallets = await getWallets({ search })

  return <DataTable columns={columns} data={wallets} />
}
