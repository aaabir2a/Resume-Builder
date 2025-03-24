"use client";

import { useState } from "react";
import { useCV } from "@/contexts/cv-context";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Plus } from "lucide-react";

export default function ExperienceForm() {
  const { cv, saveCV } = useCV();
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!cv) return null;

  const handleAddExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    saveCV({
      ...cv,
      experience: [...cv.experience, newExperience],
    });

    // Expand the newly added experience
    setExpandedIndex(cv.experience.length);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...cv.experience];
    updatedExperience.splice(index, 1);

    saveCV({
      ...cv,
      experience: updatedExperience,
    });

    // Reset expanded index if the removed item was expanded
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      // Adjust expanded index if it's after the removed item
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...cv.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };

    saveCV({
      ...cv,
      experience: updatedExperience,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>
          Add your professional experience to your CV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cv.experience.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              No experience entries yet. Add your first work experience.
            </p>
            <Button onClick={handleAddExperience}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        ) : (
          cv.experience.map((experience, index) => (
            <Card key={index} className="border border-muted">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {experience.position || "New Experience Entry"}
                  </CardTitle>
                  {experience.company && (
                    <CardDescription>
                      {experience.company}
                      {experience.location ? `, ${experience.location}` : ""}
                    </CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    {expandedIndex === index ? "Collapse" : "Expand"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveExperience(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              {expandedIndex === index && (
                <CardContent className="p-4 pt-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        value={experience.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`position-${index}`}>Position</Label>
                      <Input
                        id={`position-${index}`}
                        value={experience.position}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        placeholder="Job Title"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      value={experience.location}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                      <Input
                        id={`startDate-${index}`}
                        value={experience.startDate}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        placeholder="MM/YYYY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${index}`}>End Date</Label>
                      <Input
                        id={`endDate-${index}`}
                        value={experience.endDate}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        placeholder="MM/YYYY or Present"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={experience.description}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </CardContent>
      {cv.experience.length > 0 && (
        <CardFooter>
          <Button onClick={handleAddExperience}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Experience
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
