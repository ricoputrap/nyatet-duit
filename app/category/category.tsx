import React from 'react'
import { createClient } from '@/lib/supabase/server';

export default async function Category() {
  const supabase = await createClient();
  const { data: categories, error } = await supabase.from("categories").select();
  console.log("===== categories", categories);

  if (error) {
    console.error("Error fetching categories:", error);
    return <div>Error fetching categories</div>;
  }

  return <pre>{JSON.stringify(categories, null, 2)}</pre>

}
