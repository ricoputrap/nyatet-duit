"use server";

import { createClient } from '@/lib/supabase/server';
import { ICategory, ICategoryPageParams } from "./types";

export async function getCategories(params: ICategoryPageParams): Promise<ICategory[]> {
  const supabase = await createClient();
  const { search, sortKey, sortOrder } = params;

  let query = supabase
    .from("categories")
    .select("id, name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: categories, error } = await query
    .order(sortKey || "name", { ascending: sortOrder === 'asc' });

  // TODO handle error properly
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories as ICategory[];
}