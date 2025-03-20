"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";
import { useCV } from "@/context/cv-context";
import { useReactToPrint } from "react-to-print";

export default function CVViewPage() {
  const router = useRouter();
  const { cv, loading } = useCV();
  const [template, setTemplate] = useState("modern");
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleEdit = () => {
    router.push("/cv/edit");
  };

  const ModernTemplate = () => (
    <div
      className="bg-white p-8 max-w-4xl mx-auto shadow-lg"
      ref={componentRef}
    >
      <div className="border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          {cv?.personalInfo?.fullName || "Your Name"}
        </h1>
        <div className="mt-2 text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
          {cv?.personalInfo?.email && <div>{cv.personalInfo.email}</div>}
          {cv?.personalInfo?.phone && <div>{cv.personalInfo.phone}</div>}
          {cv?.personalInfo?.address && <div>{cv.personalInfo.address}</div>}
        </div>
        {cv?.personalInfo?.summary && (
          <p className="mt-4 text-gray-700">{cv.personalInfo.summary}</p>
        )}
      </div>

      {cv?.experience && cv.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Experience</h2>
          <div className="space-y-4">
            {cv.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <div className="text-gray-600">
                    {exp.startDate &&
                      new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    {" - "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "Present"}
                  </div>
                </div>
                <div className="text-gray-700">{exp.company}</div>
                <p className="mt-2 text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cv?.education && cv.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
          <div className="space-y-4">
            {cv.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <div className="text-gray-600">
                    {edu.startDate &&
                      new Date(edu.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    {" - "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "Present"}
                  </div>
                </div>
                <div className="text-gray-700">{edu.institution}</div>
                {edu.description && (
                  <p className="mt-2 text-gray-600">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cv?.skills && cv.skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
          <div className="grid grid-cols-2 gap-2">
            {cv.skills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <div className="font-medium">{skill.name}</div>
                <div className="ml-2 text-sm text-gray-600">
                  ({skill.level})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MinimalTemplate = () => (
    <div
      className="bg-white p-8 max-w-4xl mx-auto shadow-lg"
      ref={componentRef}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {cv?.personalInfo?.fullName || "Your Name"}
        </h1>
        <div className="mt-2 text-gray-600 flex justify-center flex-wrap gap-x-4 gap-y-1">
          {cv?.personalInfo?.email && <div>{cv.personalInfo.email}</div>}
          {cv?.personalInfo?.phone && <div>{cv.personalInfo.phone}</div>}
          {cv?.personalInfo?.address && <div>{cv.personalInfo.address}</div>}
        </div>
      </div>

      {cv?.personalInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
            Profile
          </h2>
          <p className="text-gray-700">{cv.personalInfo.summary}</p>
        </div>
      )}

      {cv?.experience && cv.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {cv.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">
                    {exp.position} at {exp.company}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {exp.startDate &&
                      new Date(exp.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    {" - "}
                    {exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "Present"}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cv?.education && cv.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-3">
            {cv.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {edu.startDate &&
                      new Date(edu.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    {" - "}
                    {edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : "Present"}
                  </div>
                </div>
                <div className="text-sm">{edu.institution}</div>
                {edu.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {cv?.skills && cv.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {cv.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {skill.name} ({skill.level})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">CV Preview</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !cv ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  You haven't created a CV yet.
                </p>
                <button
                  onClick={() => router.push("/cv/edit")}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create CV
                </button>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <label
                        htmlFor="template"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Template:
                      </label>
                      <select
                        id="template"
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="modern">Modern</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit CV
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-200 p-8 rounded-lg shadow-sm">
                  {template === "modern" ? (
                    <ModernTemplate />
                  ) : (
                    <MinimalTemplate />
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
