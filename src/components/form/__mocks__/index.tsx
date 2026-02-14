/**
 * Manual mock for @/components/form
 *
 * All form sub-components are replaced with lightweight stubs.
 * Each renders a div with a data-testid so parent component tests
 * can verify rendering and prop forwarding without pulling in
 * react-hook-form, Radix UI, and other heavy dependencies.
 */

export function FormSection(props: Record<string, unknown>) {
  return (
    <div data-testid="form-section">{props.children as React.ReactNode}</div>
  );
}

export function FormRow(props: Record<string, unknown>) {
  return <div data-testid="form-row">{props.children as React.ReactNode}</div>;
}

export function FormField(props: Record<string, unknown>) {
  return (
    <div data-testid="form-field">{props.children as React.ReactNode}</div>
  );
}

export function PersonalInfoForm() {
  return <div data-testid="personal-info-form" />;
}

export function ExperienceForm() {
  return <div data-testid="experience-form" />;
}

export function EducationForm() {
  return <div data-testid="education-form" />;
}

export function ProjectsForm() {
  return <div data-testid="projects-form" />;
}

export function ProfileLinksForm() {
  return <div data-testid="profile-links-form" />;
}

export function SkillsForm() {
  return <div data-testid="skills-form" />;
}

export function AchievementsForm() {
  return <div data-testid="achievements-form" />;
}
