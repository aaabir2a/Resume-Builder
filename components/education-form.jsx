"use client";
import { useState } from "react"
import { useCV } from "@/contexts/cv-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash, Plus } from "lucide-react"

export default function EducationForm() {
  const { cv, saveCV } = useCV()
  const [expandedIndex, setExpandedIndex] = useState(null)

  if (!cv) return null

  const handleAddEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    }

    saveCV({
      ...cv,
      education: [...cv.education, newEducation],
    })

    // Expand the newly added education
    setExpandedIndex(cv.education.length)
  }

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...cv.education]
    updatedEducation.splice(index, 1)

    saveCV({
      ...cv,
      education: updatedEducation,
    })

    // Reset expanded index if the removed item was expanded
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > index) {
      // Adjust expanded index if it's after the removed item
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...cv.education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }

    saveCV({
      ...cv,
      education: updatedEducation,
    })
  }

  return (
    (<Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
        <CardDescription>Add your educational background to your CV</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cv.education.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">No education entries yet. Add your first education entry.</p>
            <Button onClick={handleAddEducation}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>
        ) : (
          cv.education.map((education, index) => (
            <Card key={index} className="border border-muted">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{education.institution || "New Education Entry"}</CardTitle>
                  {education.degree && (
                    <CardDescription>
                      {education.degree}
                      {education.fieldOfStudy ? `, ${education.fieldOfStudy}` : ""}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                    {expandedIndex === index ? "Collapse" : "Expand"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveEducation(index)}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              {expandedIndex === index && (
                <CardContent className="p-4 pt-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      value={education.institution}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      placeholder="University or School Name" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={education.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        placeholder="Bachelor's, Master's, etc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                      <Input
                        id={`fieldOfStudy-${index}`}
                        value={education.fieldOfStudy}
                        onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                        placeholder="Computer Science, Business, etc." />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        value={education.startDate}
                        onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                        placeholder="MM/YYYY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        value={education.endDate}
                        onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                        placeholder="MM/YYYY or Present" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={education.description}
                      onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                      placeholder="Describe your studies, achievements, etc."
                      rows={3} />
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
      {cv.education.length > 0 && (
        <CardFooter>
          <Button onClick={handleAddEducation}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Education
          </Button>
        </CardFooter>
      )}
    </Card>)
  );
}

