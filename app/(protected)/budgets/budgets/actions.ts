"use server";

import { createClient, getUser } from '@/lib/supabase/server';
import { IBudget, IBudgetPageParams, IBudgetFormData } from "./types";
import { revalidatePath } from 'next/cache';

export async function getBudgets(params: IBudgetPageParams): Promise<IBudget[]> {
  const supabase = await createClient();
  const { 
    search = "", 
    sortKey = "start_date", 
    sortOrder = "desc",
    date
  } = params;

  const user = await getUser();

  let query = supabase
    .from("budgets")
    .select(`
      id,
      category_id,
      start_date,
      end_date,
      allocation,
      user_id,
      created_at,
      updated_at,
      categories (
        name
      )
    `)
    .eq("user_id", user?.id);

  // Filter by date if provided (show budgets that overlap with the selected date/month)
  if (date) {
    query = query
      .lte("start_date", date)
      .gte("end_date", date);
  }

  const { data: budgets, error } = await query
    .order(sortKey, { ascending: sortOrder === 'asc' });

  if (error) {
    console.error("Error fetching budgets:", error);
    return [];
  }

  // Transform the data to include category_name
  const transformedBudgets = budgets?.map((budget: any) => ({
    id: budget.id,
    category_id: budget.category_id,
    category_name: budget.categories?.name || '',
    start_date: budget.start_date,
    end_date: budget.end_date,
    allocation: budget.allocation,
    spent: 0, // TODO: Calculate actual spent amount from transactions
    user_id: budget.user_id,
    created_at: budget.created_at,
    updated_at: budget.updated_at,
  })) || [];

  // Filter by search (category name) on client side after join
  if (search) {
    return transformedBudgets.filter((budget: IBudget) =>
      budget.category_name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return transformedBudgets;
}

export async function createBudget(data: IBudgetFormData) {
  const supabase = await createClient();
  const user = await getUser();

  const { error } = await supabase
    .from('budgets')
    .insert([{
      category_id: data.category_id,
      start_date: data.start_date,
      end_date: data.end_date,
      allocation: data.allocation,
      user_id: user?.id
    }]);

  if (error) {
    console.error("Error creating budget:", error);
    return { error: error.message };
  }

  revalidatePath('/budgets/budgets');
  return { success: true };
}

export async function updateBudget(id: string, data: IBudgetFormData) {
  const supabase = await createClient();
  const user = await getUser();

  const { error } = await supabase
    .from('budgets')
    .update({
      category_id: data.category_id,
      start_date: data.start_date,
      end_date: data.end_date,
      allocation: data.allocation,
    })
    .eq('id', id)
    .eq('user_id', user?.id);

  if (error) {
    console.error("Error updating budget:", error);
    return { error: error.message };
  }

  revalidatePath('/budgets/budgets');
  return { success: true };
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  const user = await getUser();

  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', user?.id);

  if (error) {
    console.error("Error deleting budget:", error);
    return { error: error.message };
  }

  revalidatePath('/budgets/budgets');
  return { success: true };
}
