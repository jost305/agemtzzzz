import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("Fetching agents...")

    // First, let's check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    console.log("Available tables:", tables)

    // Try to fetch agents with a simple query first
    const { data: agents, error: agentsError } = await supabase.from("agents").select("*").limit(10)

    if (agentsError) {
      console.error("Error fetching agents:", agentsError)

      // If agents table doesn't exist, return mock data
      if (agentsError.code === "42P01") {
        console.log("Agents table doesn't exist, returning mock data")
        return NextResponse.json({
          agents: [
            {
              id: "1",
              name: "DataClean Pro",
              description: "Advanced data cleaning and processing for Nigerian businesses",
              category: "Data Processing",
              price: 15000,
              rating: 4.8,
              downloads: 1250,
              creator: "John Doe",
              status: "active",
              created_at: "2024-01-10T00:00:00Z",
            },
            {
              id: "2",
              name: "Content Genius",
              description: "AI-powered content creation in multiple Nigerian languages",
              category: "Content Creation",
              price: 25000,
              rating: 4.6,
              downloads: 890,
              creator: "Jane Smith",
              status: "pending",
              created_at: "2024-01-15T00:00:00Z",
            },
          ],
          categories: ["Data Processing", "Content Creation", "Marketing", "Customer Service"],
          total: 2,
        })
      }

      throw agentsError
    }

    console.log("Agents fetched:", agents?.length)

    // Try to fetch categories
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("name")

    let categoryList = ["Data Processing", "Content Creation", "Marketing", "Customer Service"]
    if (!categoriesError && categories) {
      categoryList = categories.map((cat: any) => cat.name)
    }

    return NextResponse.json({
      agents: agents || [],
      categories: categoryList,
      total: agents?.length || 0,
    })
  } catch (error) {
    console.error("Error in agents API:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating new agent:", body)

    const { data: agent, error } = await supabase
      .from("agents")
      .insert([
        {
          name: body.name,
          description: body.description,
          category: body.category,
          price: body.price,
          creator_id: body.creator_id,
          status: "pending", // New agents start as pending
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating agent:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log("Agent created:", agent)
    return NextResponse.json({ agent })
  } catch (error) {
    console.error("Error in POST agents:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  }
}
