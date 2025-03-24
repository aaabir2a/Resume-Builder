"use client"

import { useState } from "react"
import { useCV } from "@/contexts/cv-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash, Plus } from "lucide-react"

export default function ProjectsForm() {
  const { cv, saveCV } = useCV()
  const [expandedIndex, setExpandedIndex] = useState(null)

  if (!cv) return null

  const handleAddProject = () => {
    const newProject = {
      name: "",
      description: "",
      url: "",
    }

    saveCV({
      ...cv,
      projects: [...cv.projects, newProject],
    })

    // Expand the newly added project
    setExpandedIndex(cv.projects.length)
  }

  const handleRemoveProject = (index) => {
    const updatedProjects = [...cv.projects]
    updatedProjects.splice(index, 1)

    saveCV({
      ...cv,
      projects: updatedProjects,
    })

    // Reset expanded index if the removed item was expanded
    if (expandedIndex === index) {
      setExpandedIndex(null)
    } else if (expandedIndex !== null && expandedIndex > index) {
      // Adjust expanded index if it's after the removed item
      setExpandedIndex(expandedIndex - 1)
    }
  }

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...cv.projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }

    saveCV({
      ...cv,
      projects: updatedProjects,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Add your projects to showcase your work</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cv.projects.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">No projects added yet. Add your first project.</p>
            <Button onClick={handleAddProject}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        ) : (
          cv.projects.map((project, index) => (
            <Card key={index} className="border border-muted">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">{project.name || "New Project"}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    {expandedIndex === index ? "Collapse" : "Expand"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveProject(index)}>
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              {expandedIndex === index && (
                <CardContent className="p-4 pt-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`projectName-${index}`}>Project Name</Label>
                    <Input
                      id={`projectName-${index}`}
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                      placeholder="Project Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`projectUrl-${index}`}>Project URL (Optional)</Label>
                    <Input
                      id={`projectUrl-${index}`}
                      value={project.url || ""}
                      onChange={(e) => handleProjectChange(index, "url", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`projectDescription-${index}`}>Description</Label>
                    <Textarea
                      id={`projectDescription-${index}`}
                      value={project.description}
                      onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                      placeholder="Describe your project, technologies used, and your role"
                      rows={3}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
      {cv.projects.length > 0 && (
        <CardFooter>
          <Button onClick={handleAddProject}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Project
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

