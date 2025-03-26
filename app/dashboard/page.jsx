"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Overview } from "@/components/overview"
import { RecentCVs } from "@/components/recent-cvs"
import { PlusCircle, FileText, Clock, CheckCircle, BarChart } from "lucide-react"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCVs: 0,
    completedCVs: 0,
    averageProgress: 0,
    recentActivity: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res = await fetch("/api/cv")
        if (res.ok) {
          const data = await res.json()
          setCvs(data.cvs)

          // Calculate stats
          const totalCVs = data.cvs.length
          const completedCVs = data.cvs.filter((cv) => cv.progress === 100).length
          const averageProgress = totalCVs > 0 ? data.cvs.reduce((acc, cv) => acc + cv.progress, 0) / totalCVs : 0
          const recentActivity = data.cvs.filter((cv) => {
            const lastUpdated = new Date(cv.lastUpdated)
            const now = new Date()
            const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24))
            return diffDays < 7
          }).length

          setStats({
            totalCVs,
            completedCVs,
            averageProgress: Math.round(averageProgress),
            recentActivity,
          })
        }
      } catch (error) {
        console.error("Failed to fetch CVs:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchCVs()
    }
  }, [authLoading, user])

  const handleCreateCV = async () => {
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalInfo: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            summary: "",
            title: "",
          },
          education: [],
          experience: [],
          skills: [],
          languages: [],
          projects: [],
          certifications: [],
          progress: 0,
          template: "modern",
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/cv/${data.cv._id}`)
      }
    } catch (error) {
      console.error("Failed to create CV:", error)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button onClick={handleCreateCV}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New CV
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total CVs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCVs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCVs > 0 ? `+${stats.totalCVs}` : "0"} from your account creation
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed CVs</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedCVs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedCVs > 0
                    ? `${Math.round((stats.completedCVs / stats.totalCVs) * 100)}% completion rate`
                    : "0% completion rate"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.averageProgress > 50 ? "Good progress!" : "Keep building your CVs"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentActivity}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.recentActivity > 0
                    ? `${stats.recentActivity} CVs updated in the last 7 days`
                    : "No recent updates"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>CV Progress Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent CVs</CardTitle>
                <CardDescription>You have created {stats.totalCVs} CVs in total.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCVs cvs={cvs.slice(0, 5)} loading={loading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>CV Creation Trends</CardTitle>
                <CardDescription>Number of CVs created over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>CV Completion Rate</CardTitle>
                <CardDescription>Percentage of CVs completed vs. in progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Analytics data will appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Reports</CardTitle>
              <CardDescription>Summary of your CV creation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Report data will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No new notifications
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

