import { z } from "zod";

// Helper function to parse date strings (handles "Jan 2022", "2022", "Present", etc.)
function parseDate(dateStr: string): Date | null {
  if (!dateStr.trim()) return null;

  // Handle "Present" - treat as today's date
  if (dateStr.toLowerCase() === "present") {
    return new Date();
  }

  // Handle "Jan 2022" format
  if (dateStr.includes(" ")) {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // Handle "2022" year-only format
  if (/^\d{4}$/.test(dateStr)) {
    return new Date(parseInt(dateStr), 0, 1); // January 1st of that year
  }

  // Try parsing as-is
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Helper function to check if date is in the future
function isDateInFuture(dateStr: string): boolean {
  // "Present" is never in the future
  if (dateStr.toLowerCase() === "present") return false;

  const date = parseDate(dateStr);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  return date > today;
}

// Helper function to check if endDate is valid for currentlyWorking status
function isValidEndDateForWorkStatus(
  endDate: string,
  currentlyWorking: boolean,
): boolean {
  if (currentlyWorking) {
    // If currently working, endDate should be "Present"
    return endDate.toLowerCase() === "present";
  } else {
    // If not currently working, endDate should NOT be "Present"
    return endDate.toLowerCase() !== "present";
  }
}

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
    // Validate endDate based on currentlyWorking status
    return isValidEndDateForWorkStatus(data.endDate, data.currentlyWorking);
  })
  .refine(
    (data) => {
      const startDate = parseDate(data.startDate);
      const endDate = parseDate(data.endDate);

      // Skip validation if either date is invalid/unparseable
      if (!startDate || !endDate) return true;

      // Start date should be <= end date (Present is treated as today)
      return startDate <= endDate;
    },
    {
      message: "Start date must be before or equal to end date",
      path: ["endDate"], // Show error on end date field
    },
  );

// Education Schema
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

      // Skip validation if either date is invalid/unparseable
      if (!startDate || !endDate) return true;

      // Start year should be <= end year
      return startDate <= endDate;
    },
    {
      message: "Start year must be before or equal to end year",
      path: ["endYear"], // Show error on end year field
    },
  );

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
  portfolio: z
    .string()
    .url("Invalid Portfolio URL")
    .optional()
    .or(z.literal("")),
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
  education: z.array(educationSchema).optional().default([]),
  projects: z.array(projectSchema).optional().default([]),
  profileLinks: profileLinksSchema.optional().default({}),
  skills: skillsSchema,
});

export type ResumeFormData = z.infer<typeof resumeSchema>;
