import { PersonalInfoForm } from "@/components/form";
import { SortableSectionList } from "./SortableSectionList";
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
  sectionOrder,
  onReorderSections,
}: ResumeFormPanelProps) {
  return (
    <div className="rb-app__form-panel space-y-6 max-w-3xl mx-auto">
      <PersonalInfoForm form={form} />

      <SortableSectionList
        sectionOrder={sectionOrder}
        onReorder={onReorderSections}
        form={form}
        experienceArray={experienceArray}
        educationArray={educationArray}
        projectsArray={projectsArray}
        achievementsArray={achievementsArray}
        addExperience={addExperience}
        addEducation={addEducation}
        addProject={addProject}
        addAchievement={addAchievement}
        addBullet={addBullet}
        removeBullet={removeBullet}
        toggleCurrentlyWorking={toggleCurrentlyWorking}
      />

      {/* Mobile: Generate button (visible on small screens) */}
      <div
        data-testid="mobile-actions"
        className="rb-app__mobile-actions md:hidden"
      >
        <button
          data-testid="generate-pdf-button"
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
