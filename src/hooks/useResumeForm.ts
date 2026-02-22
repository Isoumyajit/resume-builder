/* eslint-disable react-hooks/incompatible-library */
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { resumeSchema, type ResumeFormData } from "@/lib/validation";
import sections from "@/lib/utils/section.order";

const STORAGE_KEY = "rb-section-order";

const DEFAULT_ORDER = [
  sections.experience,
  sections.education,
  sections.projects,
  sections.profileLinks,
  sections.skills,
  sections.achievements,
];

function loadSectionOrder(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) {
        return parsed as string[];
      }
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_ORDER;
}

const defaultValues: ResumeFormData = {
  personalInfo: {
    name: "",
    location: "",
    phone: "",
    email: "",
    linkedin: {
      url: "",
      displayText: "",
    },
  },
  experience: [],
  education: [],
  projects: [],
  profileLinks: {
    leetcode: "",
    github: "",
    portfolio: "",
  },
  skills: {
    languages: "",
    technologies: "",
    other: "",
  },
  achievements: [],
  sectionOrder: loadSectionOrder(),
};

export function useResumeForm() {
  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema) as Resolver<ResumeFormData>,
    defaultValues,
    mode: "onChange",
  });

  const experienceArray = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const educationArray = useFieldArray({
    control: form.control,
    name: "education",
  });

  const projectsArray = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const achievementsArray = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  const addExperience = () => {
    experienceArray.append({
      id: nanoid(),
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      techStack: "",
      bullets: [""],
      currentlyWorking: false,
    });
  };

  const addEducation = () => {
    educationArray.append({
      id: nanoid(),
      institution: "",
      degree: "",
      location: "",
      startYear: "",
      endYear: "",
    });
  };

  const addProject = () => {
    projectsArray.append({
      id: nanoid(),
      name: "",
      url: "",
      techStack: "",
      description: "",
    });
  };

  const addAchievement = () => {
    achievementsArray.append({
      id: nanoid(),
      bullet: "",
    });
  };

  const addBullet = (experienceIndex: number) => {
    const currentBullets = form.getValues(
      `experience.${experienceIndex}.bullets`,
    );
    form.setValue(`experience.${experienceIndex}.bullets`, [
      "",
      ...currentBullets,
    ]);
  };

  const removeBullet = (experienceIndex: number, bulletIndex: number) => {
    const currentBullets = form.getValues(
      `experience.${experienceIndex}.bullets`,
    );
    if (currentBullets.length > 1) {
      form.setValue(
        `experience.${experienceIndex}.bullets`,
        currentBullets.filter((_, i) => i !== bulletIndex),
      );
    }
  };

  const toggleCurrentlyWorking = (
    experienceIndex: number,
    isCurrentlyWorking: boolean,
  ) => {
    form.setValue(
      `experience.${experienceIndex}.currentlyWorking`,
      isCurrentlyWorking,
    );

    if (isCurrentlyWorking) {
      form.setValue(`experience.${experienceIndex}.endDate`, "Present");
    } else {
      form.setValue(`experience.${experienceIndex}.endDate`, "");
    }
  };

  const sectionOrder = form.watch("sectionOrder") ?? DEFAULT_ORDER;

  const reorderSections = useCallback(
    (newOrder: string[]) => {
      form.setValue("sectionOrder", newOrder);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      } catch {
        // ignore storage errors
      }
    },
    [form],
  );

  return {
    form,
    experienceArray,
    educationArray,
    projectsArray,
    achievementsArray,
    addExperience,
    addEducation,
    addProject,
    addAchievement,
    addBullet,
    removeBullet,
    toggleCurrentlyWorking,
    sectionOrder,
    reorderSections,
  };
}
