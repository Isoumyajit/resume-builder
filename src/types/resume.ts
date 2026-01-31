// Resume data types

export interface PersonalInfo {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedin?: {
    url: string;
    displayText: string;
  };
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string; // "Present" or date
  techStack: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startYear: string;
  endYear: string;
}

export interface Project {
  id: string;
  name: string;
  url?: string;
  techStack: string;
  description: string;
}

export interface ProfileLinks {
  leetcode?: string;
  github?: string;
  portfolio?: string;
}

export interface Skills {
  languages: string;
  technologies: string;
  other: string;
}

// Complete resume data structure
export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  profileLinks: ProfileLinks;
  skills: Skills;
}

// API response type
export interface GeneratePdfResponse {
  success: boolean;
  pdfBlob?: Blob;
  error?: string;
}
