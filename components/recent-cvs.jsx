"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentCVs({ cvs, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cvs || cvs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] text-center">
        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No CVs created yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {cvs.map((cv) => (
        <div key={cv._id} className="flex items-center">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {cv.personalInfo.fullName || "Untitled CV"}
            </p>
            <p className="text-sm text-muted-foreground">
              {cv.personalInfo.title || "No title"} ·{" "}
              {formatDistanceToNow(new Date(cv.lastUpdated), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/cv/${cv._id}`}>
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/cv/${cv._id}/preview`}>
                <Download className="h-4 w-4" />
                <span className="sr-only">Preview</span>
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
