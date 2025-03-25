"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CVProvider } from "@/contexts/cv-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Eye, Save } from "lucide-react";
import PersonalInfoForm from "@/components/cv/personal-info-form";
import EducationForm from "@/components/cv/education-form";
import ExperienceForm from "@/components/cv/experience-form";
import SkillsForm from "@/components/cv/skills-form";
import ProjectsForm from "@/components/cv/projects-form";
import { useCV } from "@/contexts/cv-context";

function CVEditor() {
  const { id } = useParams();
  const router = useRouter();
  const { cv, loading, error, fetchCV, saveCV } = useCV();
  const [activeTab, setActiveTab] = useState("personal");
  const [saving, setSaving] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && typeof id === "string" && !hasFetched.current) {
      hasFetched.current = true;
      fetchCV(id);
    }
  }, [id, fetchCV]);

  const handleSave = async () => {
    if (!cv) return;

    setSaving(true);
    await saveCV(cv);
    setSaving(false);
    alert("CV saved successfully!");
  };

  const handleShowPreview = async () => {
    if (!cv) return;

    setSaving(true);
    const success = await saveCV(cv);
    setSaving(false);

    if (success) {
      router.push(`/cv/${id}/preview`);
    } else {
      alert("Failed to save CV. Please try again before previewing.");
    }
  };

  const calculateProgress = () => {
    if (!cv) return 0;

    let totalFields = 0;
    let filledFields = 0;

    // Personal Info
    const personalInfoFields = Object.values(cv.personalInfo);
    totalFields += personalInfoFields.length;
    filledFields += personalInfoFields.filter(
      (field) => field && field.trim() !== ""
    ).length;

    // Education
    if (cv.education.length > 0) {
      totalFields += 5 * cv.education.length; // 5 fields per education entry
      cv.education.forEach((edu) => {
        filledFields += Object.values(edu).filter(
          (field) => field && field.toString().trim() !== ""
        ).length;
      });
    }

    // Experience
    if (cv.experience.length > 0) {
      totalFields += 5 * cv.experience.length; // 5 fields per experience entry
      cv.experience.forEach((exp) => {
        filledFields += Object.values(exp).filter(
          (field) => field && field.toString().trim() !== ""
        ).length;
      });
    }

    // Skills
    if (cv.skills.length > 0) {
      totalFields += 2 * cv.skills.length; // 2 fields per skill entry
      cv.skills.forEach((skill) => {
        filledFields += Object.values(skill).filter(
          (field) => field !== undefined && field.toString().trim() !== ""
        ).length;
      });
    }

    // Projects
    if (cv.projects.length > 0) {
      totalFields += 2 * cv.projects.length; // 2 fields per project entry
      cv.projects.forEach((project) => {
        filledFields += Object.values(project).filter(
          (field) => field && field.toString().trim() !== ""
        ).length;
      });
    }

    return Math.round((filledFields / totalFields) * 100);
  };

  if (loading && !cv) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p>Loading CV data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <p>CV not found</p>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button onClick={handleShowPreview} disabled={saving}>
            <Eye className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Show Preview"}
          </Button>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Completion Progress</h2>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <PersonalInfoForm />
        </TabsContent>
        <TabsContent value="education">
          <EducationForm />
        </TabsContent>
        <TabsContent value="experience">
          <ExperienceForm />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsForm />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CVEditorPage() {
  return (
    <CVProvider>
      <CVEditor />
    </CVProvider>
  );
}
