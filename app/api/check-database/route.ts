import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    console.log("🔍 Checking database connection and existing data...")

    // Check environment variables
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    console.log("Environment variables:", envVars)

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(10)

    if (connectionError) {
      console.error("Connection error:", connectionError)
      return NextResponse.json({
        status: "error",
        message: "Failed to connect to database",
        error: connectionError.message,
        envVars,
      })
    }

    // Check existing tables
    const existingTables = connectionTest?.map((t) => t.table_name) || []
    console.log("Existing tables:", existingTables)

    // Check for key tables and their data
    const tableChecks = {}

    // Check categories
    try {
      const { data: categories, error: catError } = await supabase.from("categories").select("id, name, slug").limit(5)

      tableChecks.categories = {
        exists: !catError,
        count: categories?.length || 0,
        sample: categories || [],
        error: catError?.message,
      }
    } catch (error) {
      tableChecks.categories = {
        exists: false,
        error: error.message,
      }
    }

    // Check agents
    try {
      const { data: agents, error: agentError } = await supabase
        .from("agents")
        .select("id, name, status, creator_id")
        .limit(5)

      tableChecks.agents = {
        exists: !agentError,
        count: agents?.length || 0,
        sample: agents || [],
        error: agentError?.message,
      }
    } catch (error) {
      tableChecks.agents = {
        exists: false,
        error: error.message,
      }
    }

    // Check profiles
    try {
      const { data: profiles, error: profileError } = await supabase.from("profiles").select("id, email, role").limit(5)

      tableChecks.profiles = {
        exists: !profileError,
        count: profiles?.length || 0,
        sample: profiles?.map((p) => ({ id: p.id, email: p.email, role: p.role })) || [],
        error: profileError?.message,
      }
    } catch (error) {
      tableChecks.profiles = {
        exists: false,
        error: error.message,
      }
    }

    // Test admin client
    let adminTest = null
    try {
      const adminClient = getSupabaseAdmin()
      const { data: adminData, error: adminError } = await adminClient.from("profiles").select("count").limit(1)

      adminTest = {
        success: !adminError,
        error: adminError?.message,
      }
    } catch (error) {
      adminTest = {
        success: false,
        error: error.message,
      }
    }

    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      connection: {
        success: true,
        url: envVars.NEXT_PUBLIC_SUPABASE_URL,
      },
      database: {
        existingTables,
        tableChecks,
        adminClient: adminTest,
      },
      envVars,
    })
  } catch (error) {
    console.error("Database check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
