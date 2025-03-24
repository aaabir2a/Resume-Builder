"use client";
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Clock, Download } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const [cvs, setCvs] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res = await fetch("/api/cv")
        if (res.ok) {
          const data = await res.json()
          setCvs(data.cvs)
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
    (<div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My CVs</h1>
        <Button onClick={handleCreateCV}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New CV
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your CVs...</p>
        </div>
      ) : cvs.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No CVs Found</h3>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t created any CVs yet. Get started by creating your first CV.
            </p>
            <Button onClick={handleCreateCV}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First CV
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <Card key={cv._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>{cv.personalInfo.fullName || "Untitled CV"}</CardTitle>
                <CardDescription>{cv.personalInfo.title || "No title specified"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="mr-2 h-4 w-4" />
                  Last updated {formatDistanceToNow(new Date(cv.lastUpdated), { addSuffix: true })}
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${cv.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">{cv.progress}% complete</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/cv/${cv._id}`}>Edit</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/cv/${cv._id}/preview`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>)
  );
}

