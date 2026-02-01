import type { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import type { ResumeFormData } from "@/lib/validation";
import {
  PersonalInfoForm,
  ExperienceForm,
  EducationForm,
  ProjectsForm,
  ProfileLinksForm,
  SkillsForm,
} from "@/components/form";

interface ResumeFormPanelProps {
  form: UseFormReturn<ResumeFormData>;
  experienceArray: UseFieldArrayReturn<ResumeFormData, "experience">;
  educationArray: UseFieldArrayReturn<ResumeFormData, "education">;
  projectsArray: UseFieldArrayReturn<ResumeFormData, "projects">;
  addExperience: () => void;
  addEducation: () => void;
  addProject: () => void;
  addBullet: (experienceIndex: number) => void;
  removeBullet: (experienceIndex: number, bulletIndex: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ResumeFormPanel({
  form,
  experienceArray,
  educationArray,
  projectsArray,
  addExperience,
  addEducation,
  addProject,
  addBullet,
  removeBullet,
  onGenerate,
  isGenerating,
}: ResumeFormPanelProps) {
  return (
    <div className="rb-app__form-panel space-y-6 max-w-3xl mx-auto">
      <PersonalInfoForm form={form} />

      <ExperienceForm
        form={form}
        fieldArray={experienceArray}
        onAddExperience={addExperience}
        onAddBullet={addBullet}
        onRemoveBullet={removeBullet}
      />

      <EducationForm
        form={form}
        fieldArray={educationArray}
        onAddEducation={addEducation}
      />

      <ProjectsForm
        form={form}
        fieldArray={projectsArray}
        onAddProject={addProject}
      />

      <ProfileLinksForm form={form} />

      <SkillsForm form={form} />

      {/* Mobile: Generate button (visible on small screens) */}
      <div className="rb-app__mobile-actions md:hidden">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="rb-app__generate-button w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );
}
