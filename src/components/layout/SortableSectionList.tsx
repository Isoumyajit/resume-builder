import { useEffect, type ReactNode, type RefObject } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import { SortableSectionItem } from "./SortableSectionItem";
import { reorderByEdge } from "@/lib/utils/reorder";
import {
  ExperienceForm,
  EducationForm,
  ProjectsForm,
  AchievementsForm,
  ProfileLinksForm,
  SkillsForm,
} from "@/components/form";

type DragHandleRef = RefObject<HTMLDivElement | null>;

interface SectionEntry {
  label: string;
  render: (dragHandleRef: DragHandleRef) => ReactNode;
}

interface SortableSectionListProps {
  sectionOrder: string[];
  onReorder: (newOrder: string[]) => void;
  form: UseFormReturn<ResumeFormData>;
  experienceArray: UseFieldArrayReturn<ResumeFormData, "experience">;
  educationArray: UseFieldArrayReturn<ResumeFormData, "education">;
  projectsArray: UseFieldArrayReturn<ResumeFormData, "projects">;
  achievementsArray: UseFieldArrayReturn<ResumeFormData, "achievements">;
  addExperience: () => void;
  addEducation: () => void;
  addProject: () => void;
  addAchievement: () => void;
  addBullet: (experienceIndex: number) => void;
  removeBullet: (experienceIndex: number, bulletIndex: number) => void;
  toggleCurrentlyWorking: (
    experienceIndex: number,
    isCurrentlyWorking: boolean,
  ) => void;
}

export function SortableSectionList({
  sectionOrder,
  onReorder,
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
}: SortableSectionListProps) {
  const sectionRegistry: Record<string, SectionEntry> = {
    experience: {
      label: "Work Experience",
      render: (ref) => (
        <ExperienceForm
          form={form}
          fieldArray={experienceArray}
          onAddExperience={addExperience}
          onAddBullet={addBullet}
          onRemoveBullet={removeBullet}
          onToggleCurrentlyWorking={toggleCurrentlyWorking}
          dragHandleRef={ref}
        />
      ),
    },
    education: {
      label: "Education",
      render: (ref) => (
        <EducationForm
          form={form}
          fieldArray={educationArray}
          onAddEducation={addEducation}
          dragHandleRef={ref}
        />
      ),
    },
    projects: {
      label: "Projects",
      render: (ref) => (
        <ProjectsForm
          form={form}
          fieldArray={projectsArray}
          onAddProject={addProject}
          dragHandleRef={ref}
        />
      ),
    },
    achievements: {
      label: "Achievements",
      render: (ref) => (
        <AchievementsForm
          form={form}
          fieldArray={achievementsArray}
          onAddAchievement={addAchievement}
          dragHandleRef={ref}
        />
      ),
    },
    profileLinks: {
      label: "Profile Links",
      render: (ref) => <ProfileLinksForm form={form} dragHandleRef={ref} />,
    },
    skills: {
      label: "Skills",
      render: (ref) => <SkillsForm form={form} dragHandleRef={ref} />,
    },
  };

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceKey = source.data.sectionKey as string;
        const targetKey = target.data.sectionKey as string;
        if (!sourceKey || !targetKey) return;

        const edge = extractClosestEdge(target.data);
        if (!edge || (edge !== "top" && edge !== "bottom")) return;

        const newOrder = reorderByEdge(
          sectionOrder,
          sourceKey,
          targetKey,
          edge,
        );
        onReorder(newOrder);
      },
    });
  }, [sectionOrder, onReorder]);

  return (
    <div className="space-y-6">
      {sectionOrder.map((key, index) => {
        const section = sectionRegistry[key];
        if (!section) return null;
        return (
          <SortableSectionItem key={key} sectionKey={key} index={index}>
            {(dragHandleRef) => section.render(dragHandleRef)}
          </SortableSectionItem>
        );
      })}
    </div>
  );
}
