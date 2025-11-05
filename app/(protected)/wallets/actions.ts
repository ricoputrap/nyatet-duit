"use server"

import { createClient, getUser } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getWallets(search?: string) {
  const supabase = await createClient()
  const user = await getUser()

  let query = supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export async function createWallet(name: string, balance: number) {
  const supabase = await createClient()
  const user = await getUser()

  const { error } = await supabase
    .from("wallets")
    .insert([{ name, balance, user_id: user.id }])

  if (error) {
    throw error
  }

  revalidatePath("/wallets")
}

export async function updateWallet(id: string, name: string, balance: number) {
  const supabase = await createClient()
  const user = await getUser()

  const { error } = await supabase
    .from("wallets")
    .update({ name, balance })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw error
  }

  revalidatePath("/wallets")
}

export async function deleteWallet(id: string) {
  const supabase = await createClient()
  const user = await getUser()

  const { error } = await supabase
    .from("wallets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw error
  }

  revalidatePath("/wallets")
}
