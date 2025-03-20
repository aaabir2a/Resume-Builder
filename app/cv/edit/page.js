"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";
import { useCV } from "@/context/cv-context";

export default function CVEditPage() {
  const router = useRouter();
  const { cv, loading, saveCV } = useCV();
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: [],
  });
  const [currentSection, setCurrentSection] = useState("personalInfo");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (cv) {
      setFormData(cv);
    }
  }, [cv]);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [field]: value,
      };
      return {
        ...prev,
        education: newEducation,
      };
    });
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience[index] = {
        ...newExperience[index],
        [field]: value,
      };
      return {
        ...prev,
        experience: newExperience,
      };
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: "", level: "Beginner" }],
    }));
  };

  const handleSkillChange = (index, field, value) => {
    setFormData((prev) => {
      const newSkills = [...prev.skills];
      newSkills[index] = {
        ...newSkills[index],
        [field]: value,
      };
      return {
        ...prev,
        skills: newSkills,
      };
    });
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveCV(formData);
      setSaveMessage("CV saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Error saving CV. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    router.push("/cv/view");
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    // Personal info (5 fields)
    total += 5;
    Object.values(formData.personalInfo).forEach((value) => {
      if (value) completed++;
    });

    // Education (at least 1)
    total += 1;
    if (formData.education.length > 0) completed++;

    // Experience (at least 1)
    total += 1;
    if (formData.experience.length > 0) completed++;

    // Skills (at least 1)
    total += 1;
    if (formData.skills.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Edit CV</h1>
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
            ) : (
              <div className="bg-white shadow rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">CV Progress</h2>
                    <span className="text-sm text-gray-500">
                      {progress}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex border-b border-gray-200 mb-6">
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        currentSection === "personalInfo"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentSection("personalInfo")}
                    >
                      Personal Info
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        currentSection === "education"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentSection("education")}
                    >
                      Education
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        currentSection === "experience"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentSection("experience")}
                    >
                      Experience
                    </button>
                    <button
                      className={`px-4 py-2 font-medium text-sm ${
                        currentSection === "skills"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setCurrentSection("skills")}
                    >
                      Skills
                    </button>
                  </div>

                  {currentSection === "personalInfo" && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.personalInfo.fullName}
                          onChange={handlePersonalInfoChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.personalInfo.email}
                          onChange={handlePersonalInfoChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.personalInfo.phone}
                          onChange={handlePersonalInfoChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.personalInfo.address}
                          onChange={handlePersonalInfoChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="summary"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Professional Summary
                        </label>
                        <textarea
                          id="summary"
                          name="summary"
                          rows={4}
                          value={formData.personalInfo.summary}
                          onChange={handlePersonalInfoChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {currentSection === "education" && (
                    <div className="space-y-6">
                      {formData.education.map((edu, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-md"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                              Education #{index + 1}
                            </h3>
                            <button
                              onClick={() => handleRemoveEducation(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Institution
                              </label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "institution",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Degree
                              </label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "degree",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Field of Study
                              </label>
                              <input
                                type="text"
                                value={edu.fieldOfStudy}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "fieldOfStudy",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={edu.startDate}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      index,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={edu.endDate}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      index,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={edu.description}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleAddEducation}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Education
                      </button>
                    </div>
                  )}

                  {currentSection === "experience" && (
                    <div className="space-y-6">
                      {formData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-md"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                              Experience #{index + 1}
                            </h3>
                            <button
                              onClick={() => handleRemoveExperience(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "company",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Position
                              </label>
                              <input
                                type="text"
                                value={exp.position}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "position",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={exp.description}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleAddExperience}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Experience
                      </button>
                    </div>
                  )}

                  {currentSection === "skills" && (
                    <div className="space-y-6">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-md"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                              Skill #{index + 1}
                            </h3>
                            <button
                              onClick={() => handleRemoveSkill(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Skill Name
                              </label>
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) =>
                                  handleSkillChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Proficiency Level
                              </label>
                              <select
                                value={skill.level}
                                onChange={(e) =>
                                  handleSkillChange(
                                    index,
                                    "level",
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Add Skill
                      </button>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between">
                    <div>
                      {saveMessage && (
                        <div
                          className={`text-sm ${
                            saveMessage.includes("Error")
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {saveMessage}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Progress"}
                      </button>
                      <button
                        onClick={handlePreview}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Preview CV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
