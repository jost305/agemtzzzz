import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    console.log("Testing database connection...")

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase.from("categories").select("count").limit(1)

    if (connectionError) {
      console.error("Connection error:", connectionError)
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: connectionError.message,
          details: connectionError,
        },
        { status: 500 },
      )
    }

    // Check if tables exist
    const tables = ["categories", "agents", "profiles"]
    const tableStatus = {}

    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1)

        tableStatus[table] = {
          exists: !error,
          error: error?.message || null,
          hasData: data && data.length > 0,
        }
      } catch (err) {
        tableStatus[table] = {
          exists: false,
          error: err.message,
          hasData: false,
        }
      }
    }

    // Get some basic counts
    const { data: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

    const { data: agentsCount } = await supabase.from("agents").select("*", { count: "exact", head: true })

    return NextResponse.json({
      status: "connected",
      message: "Database connection successful",
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
      },
      tables: tableStatus,
      counts: {
        categories: categoriesCount || 0,
        agents: agentsCount || 0,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database test failed",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
