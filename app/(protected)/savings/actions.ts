"use server"

import { revalidatePath } from "next/cache"
import { createClient, getUser } from "@/lib/supabase/server"
import { ISaving, ISavingPageParams, ISavingFormData } from "./types"

export async function getSavings(params: ISavingPageParams): Promise<ISaving[]> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from('savings')
    .select('*')
    .eq('user_id', user.id)

  // Search filter
  if (params.search) {
    query = query.ilike('name', `%${params.search}%`)
  }

  // Sorting
  if (params.sortKey && params.sortOrder) {
    query = query.order(params.sortKey, { ascending: params.sortOrder === 'asc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching savings:', error)
    return []
  }

  return data as ISaving[]
}

export async function createSaving(data: ISavingFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('savings')
    .insert({
      name: data.name,
      target: data.target,
      collected: data.collected,
      user_id: user.id,
    })

  if (error) {
    console.error('Error creating saving:', error)
    return { error: 'Failed to create saving' }
  }

  revalidatePath('/savings')
  return { success: true }
}

export async function updateSaving(id: string, data: ISavingFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('savings')
    .update({
      name: data.name,
      target: data.target,
      collected: data.collected,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating saving:', error)
    return { error: 'Failed to update saving' }
  }

  revalidatePath('/savings')
  return { success: true }
}

export async function deleteSaving(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('savings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting saving:', error)
    return { error: 'Failed to delete saving' }
  }

  revalidatePath('/savings')
  return { success: true }
}
