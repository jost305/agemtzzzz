import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing environment variables:")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
  console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✅ Set" : "❌ Missing")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  console.log("🔍 Testing Supabase connection...")
  console.log("URL:", supabaseUrl)

  try {
    // Test basic connection
    const { data, error } = await supabase.from("categories").select("count").limit(1)

    if (error) {
      console.error("❌ Connection failed:", error.message)
      return false
    }

    console.log("✅ Database connection successful!")

    // Check tables
    const tables = ["categories", "agents", "profiles"]
    console.log("\n📋 Checking tables:")

    for (const table of tables) {
      try {
        const { data, error, count } = await supabase.from(table).select("*", { count: "exact", head: true })

        if (error) {
          console.log(`❌ ${table}: ${error.message}`)
        } else {
          console.log(`✅ ${table}: ${count || 0} records`)
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`)
      }
    }

    return true
  } catch (error) {
    console.error("❌ Unexpected error:", error.message)
    return false
  }
}

testConnection().then((success) => {
  if (success) {
    console.log("\n🎉 Database is ready!")
  } else {
    console.log("\n💥 Database connection failed!")
    process.exit(1)
  }
})
