import { supabase } from "@/lib/supabase"
import { Hero } from "@/components/sections/hero"
import { FeaturedAgents } from "@/components/sections/featured-agents"
import { Categories } from "@/components/sections/categories"
import { Stats } from "@/components/sections/stats"
import { Testimonials } from "@/components/sections/testimonials"
import { Newsletter } from "@/components/sections/newsletter"

export default async function HomePage() {
  // Test database connection on homepage load
  let connectionStatus = "unknown"
  let categoriesCount = 0
  let agentsCount = 0

  try {
    // Test categories table
    const { data: categories, error: catError } = await supabase.from("categories").select("*").limit(10)

    if (!catError && categories) {
      categoriesCount = categories.length
    }

    // Test agents table
    const { data: agents, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("status", "approved")
      .limit(10)

    if (!agentError && agents) {
      agentsCount = agents.length
    }

    connectionStatus = !catError && !agentError ? "connected" : "error"
  } catch (error) {
    console.error("Database connection test failed:", error)
    connectionStatus = "failed"
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-sm">
          <strong>Debug Info:</strong> DB Status: {connectionStatus} | Categories: {categoriesCount} | Agents:{" "}
          {agentsCount}
        </div>
      )}

      <Hero />
      <FeaturedAgents />
      <Categories />
      <Stats />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
