# Data Flow

## Overview

This document describes how data flows through the Resume Builder frontend application.

---

## High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌───────────────┐   │
│  │   User   │───▶│  Form Input  │───▶│  Form State │───▶│  Ctrl+S / Btn │   │
│  │  Types   │    │  Components  │    │  (RHF)      │    │  Triggers     │   │
│  └──────────┘    └──────────────┘    └─────────────┘    └───────┬───────┘   │
│                                                                  │          │
│                                                                  ▼          │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌───────────────┐   │
│  │   User   │◀───│  PDF Preview │◀───│  Blob URL   │◀───│  API Call     │   │
│  │  Sees    │    │  Component   │    │  State      │    │  /generate-pdf│   │
│  └──────────┘    └──────────────┘    └─────────────┘    └───────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Data Flow Diagram

```
                              ┌─────────────────────────┐
                              │         App.tsx         │
                              │                         │
                              │  ┌───────────────────┐  │
                              │  │   useResumeForm   │  │
                              │  │                   │  │
                              │  │  • form           │  │
                              │  │  • experienceArr  │  │
                              │  │  • educationArr   │  │
                              │  │  • projectsArr    │  │
                              │  │  • addExperience  │  │
                              │  │  • addEducation   │  │
                              │  │  • addProject     │  │
                              │  │  • addBullet      │  │
                              │  │  • removeBullet   │  │
                              │  └─────────┬─────────┘  │
                              │            │            │
                              │  ┌─────────▼─────────┐  │
                              │  │ usePdfGeneration  │  │
                              │  │                   │  │
                              │  │  • pdfUrl         │  │
                              │  │  • isLoading      │  │
                              │  │  • error          │  │
                              │  │  • generate()     │  │
                              │  │  • downloadPdf()  │  │
                              │  └─────────┬─────────┘  │
                              │            │            │
                              │  ┌─────────▼─────────┐  │
                              │  │ useSaveShortcut   │  │
                              │  │                   │  │
                              │  │  Ctrl+S triggers  │  │
                              │  │  handleGenerate() │  │
                              │  └───────────────────┘  │
                              └────────────┬────────────┘
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     │                     │                     │
                     ▼                     ▼                     ▼
            ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
            │     Header     │    │   Form Panel   │    │  Preview Panel │
            │                │    │                │    │                │
            │ Props:         │    │ Props:         │    │ Props:         │
            │ • onDownload   │    │ • form         │    │ • pdfUrl       │
            │ • canDownload  │    │ • fieldArrays  │    │ • isLoading    │
            │ • isGenerating │    │ • add/remove   │    │ • error        │
            └────────────────┘    └───────┬────────┘    └────────────────┘
                                          │
                     ┌────────────────────┴───────────────────┐
                     │                    │                   │
                     ▼                    ▼                   ▼
            ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
            │PersonalInfoForm │  │ ExperienceForm  │  │  EducationForm  │
            │                 │  │                 │  │                 │
            │ Props:          │  │ Props:          │  │ Props:          │
            │ • form          │  │ • form          │  │ • form          │
            │                 │  │ • fieldArray    │  │ • fieldArray    │
            │ Uses:           │  │ • onAddExp      │  │ • onAddEdu      │
            │ • register()    │  │ • onAddBullet   │  │                 │
            │ • errors        │  │ • onRemoveBullet│  │ Uses:           │
            │                 │  │                 │  │ • register()    │
            │                 │  │ Uses:           │  │ • fields        │
            │                 │  │ • register()    │  │ • remove()      │
            │                 │  │ • fields        │  │                 │
            │                 │  │ • remove()      │  │                 │
            │                 │  │ • watch()       │  │                 │
            └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## Form Data Structure

```typescript
interface ResumeData {
  personalInfo: {
    name: string;
    location: string;
    phone: string;
    email: string;
    linkedin?: { url: string; displayText: string };
  };

  experience: Array<{
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    techStack: string;
    bullets: string[];
  }>;

  education: Array<{
    id: string;
    institution: string;
    degree: string;
    location: string;
    startYear: string;
    endYear: string;
  }>;

  projects: Array<{
    id: string;
    name: string;
    url?: string;
    techStack: string;
    description: string;
  }>;

  profileLinks: {
    leetcode?: string;
    github?: string;
    portfolio?: string;
  };

  skills: {
    languages: string;
    technologies: string;
    other: string;
  };
}
```

---

## Event Flow: User Types in Form

```
1. User types in input field
          │
          ▼
2. Input's onChange fires
          │
          ▼
3. react-hook-form's register() captures value
          │
          ▼
4. Form state updates (internally managed by RHF)
          │
          ▼
5. If validation error → errors object updates → Error message shown
```

---

## Event Flow: PDF Generation (Ctrl+S)

```
1. User presses Ctrl+S
          │
          ▼
2. useKeyboardShortcut detects keypress
          │
          ▼
3. Calls handleGenerate()
          │
          ▼
4. form.handleSubmit() validates with Zod
          │
          ├─── Validation Fails ──▶ Show errors, stop
          │
          ▼
5. Validation passes → Call generate(resumeData)
          │
          ▼
6. usePdfGeneration sets isLoading = true
          │
          ▼
7. API call: POST /api/generate-pdf with JSON body
          │
          ▼
8. Backend receives data → Injects into LaTeX → Compiles → Returns PDF blob
          │
          ▼
9. Frontend receives blob → Creates URL.createObjectURL(blob)
          │
          ▼
10. Sets pdfUrl state → isLoading = false
          │
          ▼
11. PdfPreview re-renders with new pdfUrl
          │
          ▼
12. react-pdf renders the PDF in the preview panel
```

---

## Event Flow: Download PDF

```
1. User clicks "Download PDF" button
          │
          ▼
2. Header calls onDownload() (passed from App)
          │
          ▼
3. downloadPdf() in usePdfGeneration executes
          │
          ▼
4. Creates temporary <a> element with href = pdfUrl
          │
          ▼
5. Sets download = "resume.pdf"
          │
          ▼
6. Programmatically clicks the link
          │
          ▼
7. Browser downloads the file
```

---

## State Locations

| State | Location | Purpose |
|-------|----------|---------|
| Form values | `useResumeForm` (RHF) | All form field values |
| Form errors | `useResumeForm` (RHF) | Validation error messages |
| Field arrays | `useResumeForm` (RHF) | Dynamic experience/education/projects |
| PDF URL | `usePdfGeneration` | Blob URL for current PDF |
| Loading state | `usePdfGeneration` | Show spinner during generation |
| Error state | `usePdfGeneration` | API error messages |

---

## Props Drilling Pattern

```
App.tsx (state owner)
    │
    ├── Header
    │   └── onDownload, canDownload, isGenerating
    │
    ├── PersonalInfoForm
    │   └── form (UseFormReturn)
    │
    ├── ExperienceForm
    │   └── form, fieldArray, onAddExperience, onAddBullet, onRemoveBullet
    │
    ├── EducationForm
    │   └── form, fieldArray, onAddEducation
    │
    ├── ProjectsForm
    │   └── form, fieldArray, onAddProject
    │
    ├── ProfileLinksForm
    │   └── form
    │
    ├── SkillsForm
    │   └── form
    │
    └── PdfPreview
        └── pdfUrl, isLoading, error
```

---

## Why No Global State?

1. **Form state is self-contained** - React Hook Form manages all form data internally
2. **PDF state is simple** - Just a URL, loading flag, and error
3. **No cross-cutting concerns** - Components don't need to share state with siblings
4. **Props drilling is shallow** - Only 1-2 levels deep

If the app grows to need features like:
- Multiple resume drafts
- User authentication
- Undo/redo

Then consider adding Zustand or React Context.
