"use client";

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
import { Slider } from "@/components/ui/slider";
import { Trash, Plus } from "lucide-react";

export default function SkillsForm() {
  const { cv, saveCV } = useCV();

  if (!cv) return null;

  const handleAddSkill = () => {
    const newSkill = {
      name: "",
      level: 3,
    };

    saveCV({
      ...cv,
      skills: [...cv.skills, newSkill],
    });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...cv.skills];
    updatedSkills.splice(index, 1);

    saveCV({
      ...cv,
      skills: updatedSkills,
    });
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...cv.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    };

    saveCV({
      ...cv,
      skills: updatedSkills,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>
          Add your skills and proficiency levels to your CV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {cv.skills.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              No skills added yet. Add your first skill.
            </p>
            <Button onClick={handleAddSkill}>
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </div>
        ) : (
          cv.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`skill-${index}`}>Skill Name</Label>
                <Input
                  id={`skill-${index}`}
                  value={skill.name}
                  onChange={(e) =>
                    handleSkillChange(index, "name", e.target.value)
                  }
                  placeholder="e.g., JavaScript, Project Management, etc."
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor={`level-${index}`}>Proficiency Level</Label>
                  <span className="text-sm text-muted-foreground">
                    {skill.level}/5
                  </span>
                </div>
                <Slider
                  id={`level-${index}`}
                  min={1}
                  max={5}
                  step={1}
                  value={[skill.level]}
                  onValueChange={(value) =>
                    handleSkillChange(index, "level", value[0])
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSkill(index)}
                className="mt-6"
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
      {cv.skills.length > 0 && (
        <CardFooter>
          <Button onClick={handleAddSkill}>
            <Plus className="mr-2 h-4 w-4" />
            Add Another Skill
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
