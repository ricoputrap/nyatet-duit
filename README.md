# Nyatet Duit

## Description
Nyatet Duit is a simple and user-friendly personal finance management application designed to help users track their income and expenses. With Nyatet Duit, users can easily record their financial transactions, categorize them, and generate reports to better understand their spending habits.

---

## How to setup Supabase

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// app/category/category.tsx (server component)
import { createClient } from '@/lib/supabase/server';

export default async function Category() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase.from("categories").select();

  if (error) {
    console.error("Error fetching categories:", error);
    return <div>Error fetching categories</div>;
  }

  return <pre>{JSON.stringify(categories, null, 2)}</pre>
}

// app/category/page.tsx (page component)
import { Suspense } from "react";
import Category from "./category";

export default async function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <Category />
    </Suspense>
  )
}
```