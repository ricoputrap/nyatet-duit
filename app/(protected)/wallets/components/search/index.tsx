import { SearchInput } from "./search-input"
import { IWalletPageParams } from "../../types"

interface Props {
  searchParams: Promise<IWalletPageParams>
}

export default async function Search({ searchParams }: Props) {
  await searchParams
  return <SearchInput />
}
