"use client";

import { useCV } from "@/contexts/cv-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PersonalInfoForm() {
  const { cv, saveCV } = useCV();

  if (!cv) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    saveCV({
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [name]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Add your personal details to your CV</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={cv.personalInfo.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              name="title"
              value={cv.personalInfo.title}
              onChange={handleChange}
              placeholder="Software Engineer"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={cv.personalInfo.email}
              onChange={handleChange}
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={cv.personalInfo.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={cv.personalInfo.address}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            value={cv.personalInfo.summary}
            onChange={handleChange}
            placeholder="A brief summary of your professional background and career goals"
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}
