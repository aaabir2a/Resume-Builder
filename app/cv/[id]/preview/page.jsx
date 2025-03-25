"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { CVProvider, useCV } from "@/contexts/cv-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function CVPreview() {
  const { id } = useParams();
  const router = useRouter();
  const { cv, loading, error, fetchCV } = useCV();
  const cvRef = useRef(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && typeof id === "string" && !hasFetched.current) {
      hasFetched.current = true;
      fetchCV(id);
    }
  }, [id, fetchCV]);

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return;

    const canvas = await html2canvas(cvRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${cv?.personalInfo.fullName || "CV"}.pdf`);
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.push(`/cv/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Editor
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <Eye className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="p-8 max-w-4xl mx-auto bg-white shadow-lg">
        <div ref={cvRef} className="cv-preview">
          {/* CV Header */}
          <div className="mb-6 border-b pb-6">
            <h1 className="text-3xl font-bold mb-1">
              {cv.personalInfo.fullName}
            </h1>
            {cv.personalInfo.title && (
              <h2 className="text-xl text-muted-foreground mb-4">
                {cv.personalInfo.title}
              </h2>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {cv.personalInfo.email && (
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  {cv.personalInfo.email}
                </div>
              )}
              {cv.personalInfo.phone && (
                <div>
                  <span className="font-semibold">Phone:</span>{" "}
                  {cv.personalInfo.phone}
                </div>
              )}
              {cv.personalInfo.address && (
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {cv.personalInfo.address}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {cv.personalInfo.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 border-b pb-1">
                Professional Summary
              </h3>
              <p>{cv.personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cv.experience.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 border-b pb-1">
                Work Experience
              </h3>
              <div className="space-y-4">
                {cv.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-muted-foreground">
                          {exp.company}
                          {exp.location && `, ${exp.location}`}
                        </p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-sm text-muted-foreground">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                      )}
                    </div>
                    {exp.description && (
                      <p className="mt-2 text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {cv.education.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 border-b pb-1">
                Education
              </h3>
              <div className="space-y-4">
                {cv.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-muted-foreground">
                          {edu.institution}
                          {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                        </p>
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <p className="text-sm text-muted-foreground">
                          {edu.startDate} - {edu.endDate || "Present"}
                        </p>
                      )}
                    </div>
                    {edu.description && (
                      <p className="mt-2 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {cv.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 border-b pb-1">Skills</h3>
              <div className="grid grid-cols-2 gap-2">
                {cv.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{skill.name}</span>
                    <div className="flex-1 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-full rounded-full ${
                            i < skill.level ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {cv.projects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 border-b pb-1">Projects</h3>
              <div className="space-y-4">
                {cv.projects.map((project, index) => (
                  <div key={index}>
                    <h4 className="font-semibold">
                      {project.name}
                      {project.url && (
                        <span className="font-normal text-sm ml-2">
                          (
                          <a
                            href={project.url}
                            className="text-primary hover:underline"
                          >
                            Link
                          </a>
                          )
                        </span>
                      )}
                    </h4>
                    {project.description && (
                      <p className="mt-1 text-sm">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function CVPreviewPage() {
  return (
    <CVProvider>
      <CVPreview />
    </CVProvider>
  );
}
