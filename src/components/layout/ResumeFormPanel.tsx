import {
  PersonalInfoForm,
  ExperienceForm,
  EducationForm,
  ProjectsForm,
  ProfileLinksForm,
  SkillsForm,
  AchievementsForm,
} from "@/components/form";
import type { ResumeFormPanelProps } from "@/interfaces/components";

export function ResumeFormPanel({
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
        onToggleCurrentlyWorking={toggleCurrentlyWorking}
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

      <AchievementsForm
        form={form}
        fieldArray={achievementsArray}
        onAddAchievement={addAchievement}
      />

      <ProfileLinksForm form={form} />

      <SkillsForm form={form} />

      {/* Mobile: Generate button (visible on small screens) */}
      <div className="rb-app__mobile-actions md:hidden">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="rb-app__generate-button w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          {isGenerating ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );
}
