import { supabase } from "../lib/supabase"
import { getSupabaseAdmin } from "../lib/supabase-admin"

async function checkExistingDatabase() {
  console.log("🔍 Checking Existing Database Setup...\n")

  // Environment check
  console.log("📋 Environment Variables:")
  console.log(`✓ SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`✓ ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}`)
  console.log(`✓ SERVICE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"}`)
  console.log("")

  // Test connection
  console.log("🔗 Testing Database Connection...")
  try {
    const { data: tables, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (error) {
      console.error("❌ Connection failed:", error.message)
      return
    }

    console.log("✅ Connected successfully!")
    console.log(`📊 Found ${tables?.length || 0} tables in public schema`)
    console.log("")

    // List existing tables
    if (tables && tables.length > 0) {
      console.log("🏗️ Existing Tables:")
      tables.forEach((table) => {
        console.log(`   - ${table.table_name}`)
      })
      console.log("")
    }

    // Check key tables and their data
    const keyTables = ["categories", "agents", "profiles"]

    for (const tableName of keyTables) {
      console.log(`📋 Checking ${tableName} table...`)
      try {
        const { data, error, count } = await supabase.from(tableName).select("*", { count: "exact" }).limit(3)

        if (error) {
          console.log(`   ❌ Error: ${error.message}`)
        } else {
          console.log(`   ✅ Table exists with ${count || 0} records`)
          if (data && data.length > 0) {
            console.log(`   📄 Sample data:`)
            data.forEach((record, index) => {
              const preview = Object.keys(record)
                .slice(0, 3)
                .map((key) => `${key}: ${String(record[key]).substring(0, 30)}`)
                .join(", ")
              console.log(`      ${index + 1}. ${preview}`)
            })
          }
        }
      } catch (err) {
        console.log(`   ❌ Table not accessible: ${err.message}`)
      }
      console.log("")
    }

    // Test admin access
    console.log("🔐 Testing Admin Client...")
    try {
      const adminClient = getSupabaseAdmin()
      const { data: adminTest, error: adminError } = await adminClient.from("profiles").select("count").limit(1)

      if (adminError) {
        console.log("   ❌ Admin access failed:", adminError.message)
      } else {
        console.log("   ✅ Admin client working correctly")
      }
    } catch (err) {
      console.log("   ❌ Admin client error:", err.message)
    }
  } catch (error) {
    console.error("❌ Database check failed:", error)
  }

  console.log("\n🎉 Database check completed!")
}

// Run the check
checkExistingDatabase().catch(console.error)
