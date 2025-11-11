import { Suspense } from "react"
import SearchInput from "./search-input"
import Loading from "./loading"

export default function Search() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchInput />
    </Suspense>
  )
}
