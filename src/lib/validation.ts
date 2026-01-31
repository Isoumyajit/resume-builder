import { z } from "zod";

// Personal Info Schema
export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  linkedin: z
    .object({
      url: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
      displayText: z.string().optional(),
    })
    .optional(),
});

// Experience Schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  techStack: z.string().optional().default(""),
  bullets: z.array(z.string()).min(1, "At least one bullet point is required"),
});

// Education Schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  location: z.string().min(1, "Location is required"),
  startYear: z.string().min(1, "Start year is required"),
  endYear: z.string().min(1, "End year is required"),
});

// Project Schema
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  techStack: z.string().min(1, "Tech stack is required"),
  description: z.string().min(1, "Description is required"),
});

// Profile Links Schema
export const profileLinksSchema = z.object({
  leetcode: z.string().url("Invalid LeetCode URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
});

// Skills Schema
export const skillsSchema = z.object({
  languages: z.string().optional().default(""),
  technologies: z.string().optional().default(""),
  other: z.string().optional().default(""),
});

// Complete Resume Schema
export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  profileLinks: profileLinksSchema,
  skills: skillsSchema,
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
