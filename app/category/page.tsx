import { Suspense } from "react";
import Category from "./category";

export default async function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <Category />
    </Suspense>
  )
}