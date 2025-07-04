import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Quick health check
    const { data, error } = await supabase.from("categories").select("count").limit(1)

    if (error) {
      return NextResponse.json({
        status: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      status: "connected",
      message: "Database is accessible",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
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
