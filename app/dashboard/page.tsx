"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CalendarIcon,
  Clock,
  ShoppingBag,
  TrendingUp,
  CheckCircle,
  Heart,
  Eye,
  Star,
} from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  category: string
  purchaseDate: string
  status: "active" | "setup_required" | "inactive"
  price: number
  usage?: number
  lastUsed?: string
}

interface UserStats {
  agentsPurchased: number
  totalSpent: number
  activeAgents: number
  favoriteAgents: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [userStats, setUserStats] = useState<UserStats>({
    agentsPurchased: 0,
    totalSpent: 0,
    activeAgents: 0,
    favoriteAgents: 0,
  })
  const [recentPurchases, setRecentPurchases] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  // Performance data
  const performanceData = {
    delivered: { value: 42642.1, change: 2.5, trend: "up" as const },
    opened: { value: 26843, change: -0.2, trend: "down" as const },
    clicked: { value: 525753, change: 12.3, trend: "up" as const },
    subscribed: { value: 425, change: 5.1, trend: "up" as const },
  }

  // Recommendations
  const recommendations = [
    {
      id: "1",
      name: "Sales Automation Pro",
      category: "Sales & Marketing",
      rating: 4.9,
      price: 40000,
      description: "Automate your sales pipeline with AI-powered lead qualification",
    },
    {
      id: "2",
      name: "Invoice Generator AI",
      category: "Finance",
      rating: 4.7,
      price: 20000,
      description: "Generate professional invoices with Nigerian tax compliance",
    },
  ]

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = async () => {
      try {
        // Mock data - replace with actual API calls
        setUserStats({
          agentsPurchased: 5,
          totalSpent: 125000,
          activeAgents: 4,
          favoriteAgents: 8,
        })

        setRecentPurchases([
          {
            id: "1",
            name: "DataClean Pro",
            category: "Data Processing",
            purchaseDate: "2024-01-15",
            status: "active",
            price: 25000,
            usage: 85,
            lastUsed: "2 hours ago",
          },
          {
            id: "2",
            name: "Content Genius",
            category: "Content Creation",
            purchaseDate: "2024-01-10",
            status: "active",
            price: 35000,
            usage: 92,
            lastUsed: "1 day ago",
          },
          {
            id: "3",
            name: "ChatBot Nigeria",
            category: "Customer Service",
            purchaseDate: "2024-01-05",
            status: "setup_required",
            price: 45000,
            usage: 0,
            lastUsed: "Never",
          },
        ])
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "setup_required":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, {user?.user_metadata?.first_name || "User"}! Let's dive into your personalized setup guide.
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/marketplace">
            <Plus className="h-4 w-4 mr-2" />
            Browse Agents
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agents Purchased</p>
                <p className="text-2xl font-bold">{userStats.agentsPurchased}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(userStats.totalSpent)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">{userStats.activeAgents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                <p className="text-2xl font-bold">{userStats.favoriteAgents}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Over Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>29 Sept, 2024</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Sort
            </Button>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatNumber(performanceData.delivered.value)}</span>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-3 w-3" />+{performanceData.delivered.change}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Opened</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatNumber(performanceData.opened.value)}</span>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  {performanceData.opened.change}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Clicked</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatNumber(performanceData.clicked.value)}</span>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-3 w-3" />+{performanceData.clicked.change}%
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Subscribe</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{formatNumber(performanceData.subscribed.value)}</span>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-3 w-3" />+{performanceData.subscribed.change}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>My AI Agents</CardTitle>
            <CardDescription>Manage and monitor your purchased AI automation solutions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{agent.category}</Badge>
                        <Badge className={getStatusColor(agent.status)}>
                          {agent.status === "active" ? "Active" : "Setup Required"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Purchased on {new Date(agent.purchaseDate).toLocaleDateString()}
                      </p>
                      {agent.usage !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Usage: {agent.usage}%</span>
                            <span>Last used: {agent.lastUsed}</span>
                          </div>
                          <Progress value={agent.usage} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-green-600">{formatCurrency(agent.price)}</span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/agents/${agent.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    {agent.status === "setup_required" && <Button size="sm">Setup</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule/Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule Agent</CardTitle>
            <CardDescription>September 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border-0" />

              <div className="space-y-2">
                <div className="text-sm font-medium">Today</div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">Element of Design Test</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>10:00 - 11:00 AM</span>
                  </div>
                </div>

                <div className="text-sm font-medium">Sat, Jan 20</div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">Design Principle Test</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>10:00 - 11:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>AI agents that complement your current automation setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {agent.category}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm">{agent.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600">{formatCurrency(agent.price)}</span>
                  <Button size="sm" asChild>
                    <Link href={`/agents/${agent.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
