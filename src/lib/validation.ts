import { z } from "zod";
import sections from "./utils/section.order";

function parseDate(dateStr: string): Date | null {
  if (!dateStr.trim()) return null;

  if (dateStr.toLowerCase() === "present") {
    return new Date();
  }

  if (dateStr.includes(" ")) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1);
  }

  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

function isDateInFuture(dateStr: string): boolean {
  if (dateStr.toLowerCase() === "present") return false;

  const date = parseDate(dateStr);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date > today;
}

function isValidEndDateForWorkStatus(
  endDate: string,
  currentlyWorking: boolean,
): boolean {
  if (currentlyWorking) {
    return endDate.toLowerCase() === "present";
  } else {
    return endDate.toLowerCase() !== "present";
  }
}

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

export const experienceSchema = z
  .object({
    id: z.string(),
    company: z.string().min(1, "Company is required"),
    title: z.string().min(1, "Job title is required"),
    location: z.string().min(1, "Location is required"),
    startDate: z
      .string()
      .min(1, "Start date is required")
      .refine((date) => !isDateInFuture(date), {
        message: "Start date cannot be in the future",
      }),
    endDate: z
      .string()
      .min(1, "End date is required")
      .refine((date) => !isDateInFuture(date), {
        message: "End date cannot be in the future",
      }),
    techStack: z.string().optional().default(""),
    currentlyWorking: z.boolean().optional().default(false),
    bullets: z
      .array(z.string())
      .min(1, "At least one bullet point is required"),
  })
  .refine(
    (data) => {
      return data.bullets.every((bullet) => bullet.length <= 300);
    },
    {
      message: "Each bullet point must be less than or equal to 300 characters",
      path: ["bullets"],
    },
  )
  .refine((data) => {
    return isValidEndDateForWorkStatus(data.endDate, data.currentlyWorking);
  })
  .refine(
    (data) => {
      const startDate = parseDate(data.startDate);
      const endDate = parseDate(data.endDate);

      if (!startDate || !endDate) return true;

      return startDate <= endDate;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"],
    },
  );

export const educationSchema = z
  .object({
    id: z.string(),
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    location: z.string().min(1, "Location is required"),
    startYear: z
      .string()
      .min(1, "Start year is required")
      .refine((year) => !isDateInFuture(year), {
        message: "Start year cannot be in the future",
      }),
    endYear: z
      .string()
      .min(1, "End year is required")
      .refine((year) => !isDateInFuture(year), {
        message: "End year cannot be in the future",
      }),
  })
  .refine(
    (data) => {
      const startDate = parseDate(data.startYear);
      const endDate = parseDate(data.endYear);

      if (!startDate || !endDate) return true;

      return startDate <= endDate;
    },
    {
      message: "Start year must be before or equal to end year",
      path: ["endYear"],
    },
  );

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  techStack: z.string().min(1, "Tech stack is required"),
  description: z.string().min(1, "Description is required"),
});

export const profileLinksSchema = z.object({
  leetcode: z.string().url("Invalid LeetCode URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z
    .string()
    .url("Invalid Portfolio URL")
    .optional()
    .or(z.literal("")),
});

export const skillsSchema = z.object({
  languages: z.string().optional().default(""),
  technologies: z.string().optional().default(""),
  other: z.string().optional().default(""),
});

export const achievementSchema = z
  .object({
    id: z.string(),
    bullet: z.string().min(1, "Achievement is required"),
  })
  .refine(
    (data) => {
      const charCountWithoutSpaces = data.bullet.replace(/\s/g, "").length;
      return charCountWithoutSpaces <= 100;
    },
    {
      path: ["bullet"],
    },
  );

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  profileLinks: profileLinksSchema.optional().default({}),
  skills: skillsSchema,
  achievements: z.array(achievementSchema).optional().default([]),
  sectionOrder: z
    .array(
      z.enum([
        sections.experience,
        sections.education,
        sections.projects,
        sections.profileLinks,
        sections.skills,
        sections.achievements,
      ]),
    )
    .optional()
    .default([
      sections.experience,
      sections.education,
      sections.projects,
      sections.profileLinks,
      sections.skills,
      sections.achievements,
    ]),
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
