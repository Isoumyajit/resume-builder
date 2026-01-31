import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema, type ResumeFormData } from "../lib/validation";
import { nanoid } from "nanoid";

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
};

export function useResumeForm() {
  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
    mode: "onChange",
  });

  // Field arrays for dynamic sections
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

  // Helper functions to add new items
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

  // Add a bullet point to a specific experience
  const addBullet = (experienceIndex: number) => {
    const currentBullets = form.getValues(`experience.${experienceIndex}.bullets`);
    form.setValue(`experience.${experienceIndex}.bullets`, [...currentBullets, ""]);
  };

  // Remove a bullet point from a specific experience
  const removeBullet = (experienceIndex: number, bulletIndex: number) => {
    const currentBullets = form.getValues(`experience.${experienceIndex}.bullets`);
    if (currentBullets.length > 1) {
      form.setValue(
        `experience.${experienceIndex}.bullets`,
        currentBullets.filter((_, i) => i !== bulletIndex)
      );
    }
  };

  return {
    form,
    experienceArray,
    educationArray,
    projectsArray,
    addExperience,
    addEducation,
    addProject,
    addBullet,
    removeBullet,
  };
}
