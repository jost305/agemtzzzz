import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    console.log("Creating demo admin user...")

    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: "admin@9jaagents.com",
      password: "Admin123!",
      user_metadata: {
        role: "admin",
        full_name: "Admin User",
      },
      email_confirm: true,
    })

    if (adminError) {
      console.error("Error creating admin user:", adminError)
      return NextResponse.json({ error: adminError.message }, { status: 400 })
    }

    console.log("Admin user created:", adminData.user?.email)

    // Create creator user
    const { data: creatorData, error: creatorError } = await supabase.auth.admin.createUser({
      email: "creator@9jaagents.com",
      password: "Creator123!",
      user_metadata: {
        role: "creator",
        full_name: "Creator User",
      },
      email_confirm: true,
    })

    if (creatorError) {
      console.error("Error creating creator user:", creatorError)
    } else {
      console.log("Creator user created:", creatorData.user?.email)
    }

    // Create regular user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: "user@9jaagents.com",
      password: "User123!",
      user_metadata: {
        role: "user",
        full_name: "Regular User",
      },
      email_confirm: true,
    })

    if (userError) {
      console.error("Error creating regular user:", userError)
    } else {
      console.log("Regular user created:", userData.user?.email)
    }

    return NextResponse.json({
      success: true,
      message: "Demo users created successfully",
      users: {
        admin: adminData.user?.email,
        creator: creatorData.user?.email,
        user: userData.user?.email,
      },
    })
  } catch (error) {
    console.error("Error in create-demo-users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
