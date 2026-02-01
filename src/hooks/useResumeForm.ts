import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { resumeSchema, type ResumeFormData } from "@/lib/validation";

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

  const addBullet = (experienceIndex: number) => {
    const currentBullets = form.getValues(
      `experience.${experienceIndex}.bullets`,
    );
    form.setValue(`experience.${experienceIndex}.bullets`, [
      ...currentBullets,
      "",
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
    toggleCurrentlyWorking,
  };
}
