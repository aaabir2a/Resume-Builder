"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  FileText,
  Clock,
  Download,
  Search,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CVsPage() {
  const { user, loading: authLoading } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res = await fetch("/api/cv");
        if (res.ok) {
          const data = await res.json();
          setCvs(data.cvs);
        }
      } catch (error) {
        console.error("Failed to fetch CVs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCVs();
    }
  }, [authLoading, user]);

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
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/cv/${data.cv._id}`);
      }
    } catch (error) {
      console.error("Failed to create CV:", error);
    }
  };

  const handleDeleteCV = async (id) => {
    try {
      const res = await fetch(`/api/cv/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCvs(cvs.filter((cv) => cv._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete CV:", error);
    }
  };

  const filteredCVs = cvs.filter((cv) => {
    const fullName = cv.personalInfo.fullName.toLowerCase();
    const title = cv.personalInfo.title.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || title.includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My CVs</h2>
          <p className="text-muted-foreground">
            Manage and organize all your CV documents
          </p>
        </div>
        <Button onClick={handleCreateCV}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New CV
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search CVs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your CVs...</p>
        </div>
      ) : filteredCVs.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No CVs Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "No CVs match your search criteria."
                : "You haven't created any CVs yet. Get started by creating your first CV."}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateCV}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First CV
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCVs.map((cv) => (
            <Card key={cv._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle>
                  {cv.personalInfo.fullName || "Untitled CV"}
                </CardTitle>
                <CardDescription>
                  {cv.personalInfo.title || "No title specified"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="mr-2 h-4 w-4" />
                  Last updated{" "}
                  {formatDistanceToNow(new Date(cv.lastUpdated), {
                    addSuffix: true,
                  })}
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${cv.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {cv.progress}% complete
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/cv/${cv._id}`}>Edit</Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your CV.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCV(cv._id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/cv/${cv._id}/preview`}>
                    <Download className="mr-2 h-4 w-4" />
                    Preview
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
