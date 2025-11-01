"use server";

import { createClient } from '@/lib/supabase/server';
import { ICategory, ICategoryPageParams } from "./types";
import { revalidatePath } from 'next/cache';

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

export async function createCategory(name: string){
  const supabase = await createClient();

    const { error } = await supabase
    .from('categories')
    .insert([{ name }]);

  // TODO handle error properly
  if (error) {
    console.error("Error creating category:", error);
    return null;
  }

  revalidatePath('/dashboard/budgets/categories');
}

export async function updateCategory(id: string, name: string){
  const supabase = await createClient();

  const { error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id);

  // TODO handle error properly
  if (error) {
    console.error("Error updating category:", error);
    return null;
  }

  revalidatePath('/dashboard/budgets/categories');
}

export async function deleteCategory(id: string){
  const supabase = await createClient();

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  // TODO handle error properly
  if (error) {
    console.error("Error deleting category:", error);
    return null;
  }

  revalidatePath('/dashboard/budgets/categories');
}