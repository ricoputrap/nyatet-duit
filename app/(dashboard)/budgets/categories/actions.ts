"use server";

import { createClient } from '@/lib/supabase/server';
import { ICategory, ICategoryPageParams } from "./types";

export async function getCategories(params: ICategoryPageParams): Promise<ICategory[]> {
  const supabase = await createClient();
  const { 
    search = "", 
    sortKey = "name", 
    sortOrder = "asc" 
  } = params;

  let query = supabase
    .from("categories")
    .select("id, name");

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: categories, error } = await query
    .order(sortKey, { ascending: sortOrder === 'asc' });

  // TODO handle error properly
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories as ICategory[];
}

export async function getCategoryById(id: string): Promise<ICategory | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }

  return data as ICategory;
}