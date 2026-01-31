# Frontend Architecture

## Overview

The Resume Builder frontend is built with React + TypeScript + Vite, following a modular component-based architecture.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| React Hook Form | Form State Management |
| Zod | Schema Validation |
| react-pdf | PDF Rendering |
| react-resizable-panels | Split Pane Layout |

---

## Directory Structure

```
src/
├── api/                    # API Layer
│   ├── index.ts           # Exports
│   └── resume.ts          # API calls (generatePdf, healthCheck)
│
├── components/
│   ├── form/              # Form Section Components
│   │   ├── FormSection.tsx        # Reusable wrapper (card with title)
│   │   ├── PersonalInfoForm.tsx   # Name, email, phone, location
│   │   ├── ExperienceForm.tsx     # Work experience (dynamic array)
│   │   ├── EducationForm.tsx      # Education (dynamic array)
│   │   ├── ProjectsForm.tsx       # Projects (dynamic array)
│   │   ├── ProfileLinksForm.tsx   # GitHub, LeetCode, Portfolio
│   │   ├── SkillsForm.tsx         # Languages, Technologies, Other
│   │   └── index.ts
│   │
│   ├── layout/            # Layout Components
│   │   ├── Header.tsx     # App header with download button
│   │   ├── SplitPane.tsx  # Resizable left/right panels
│   │   └── index.ts
│   │
│   ├── preview/           # PDF Preview Components
│   │   ├── PdfPreview.tsx # PDF viewer (loading, error, display states)
│   │   └── index.ts
│   │
│   └── ui/                # shadcn/ui Primitives
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── ...
│
├── hooks/                 # Custom React Hooks
│   ├── useResumeForm.ts       # Form state + field arrays
│   ├── usePdfGeneration.ts    # PDF generation + blob management
│   ├── useKeyboardShortcut.ts # Ctrl+S handler
│   └── index.ts
│
├── lib/                   # Utilities
│   ├── utils.ts           # cn() helper for Tailwind
│   └── validation.ts      # Zod schemas
│
├── types/                 # TypeScript Definitions
│   ├── resume.ts          # ResumeData, Experience, etc.
│   └── index.ts
│
├── App.tsx                # Main Application Component
├── App.css                # Custom Styles
├── index.css              # Tailwind Base + Theme
└── main.tsx               # React Entry Point
```

---

## Component Hierarchy

```
App
├── Header
│   ├── Logo + Title
│   ├── GitHub Link
│   └── Download Button
│
└── SplitPane (resizable)
    │
    ├── [Left Panel - Form]
    │   ├── PersonalInfoForm
    │   │   └── FormSection
    │   │       ├── Input (name)
    │   │       ├── Input (location)
    │   │       ├── Input (phone)
    │   │       ├── Input (email)
    │   │       └── Input (linkedin)
    │   │
    │   ├── ExperienceForm
    │   │   └── FormSection
    │   │       └── [Experience Card] × N
    │   │           ├── Input (title, company, location)
    │   │           ├── Input (techStack, dates)
    │   │           └── [Bullet Points] × M
    │   │
    │   ├── EducationForm
    │   │   └── FormSection
    │   │       └── [Education Card] × N
    │   │
    │   ├── ProjectsForm
    │   │   └── FormSection
    │   │       └── [Project Card] × N
    │   │
    │   ├── ProfileLinksForm
    │   │   └── FormSection
    │   │       ├── Input (github)
    │   │       ├── Input (leetcode)
    │   │       └── Input (portfolio)
    │   │
    │   └── SkillsForm
    │       └── FormSection
    │           ├── Textarea (languages)
    │           ├── Textarea (technologies)
    │           └── Textarea (other)
    │
    └── [Right Panel - Preview]
        └── PdfPreview
            ├── Loading State (spinner)
            ├── Error State (error message)
            ├── Empty State (placeholder)
            └── PDF Display (react-pdf Document/Page)
```

---

## Component Responsibilities

### Layout Components

| Component | Responsibility |
|-----------|----------------|
| `Header` | App branding, GitHub link, Download PDF button |
| `SplitPane` | Resizable two-panel layout using react-resizable-panels |

### Form Components

| Component | Responsibility |
|-----------|----------------|
| `FormSection` | Reusable card wrapper with title and optional action button |
| `PersonalInfoForm` | Static form for personal details |
| `ExperienceForm` | Dynamic form with add/remove for work experience |
| `EducationForm` | Dynamic form with add/remove for education |
| `ProjectsForm` | Dynamic form with add/remove for projects |
| `ProfileLinksForm` | Static form for profile URLs |
| `SkillsForm` | Static form for technical skills |

### Preview Components

| Component | Responsibility |
|-----------|----------------|
| `PdfPreview` | Renders PDF using react-pdf, handles loading/error/empty states |

---

## Hooks

| Hook | Purpose |
|------|---------|
| `useResumeForm` | Manages form state with react-hook-form + Zod validation |
| `usePdfGeneration` | Handles API calls and PDF blob URL management |
| `useKeyboardShortcut` | Registers global keyboard shortcuts (Ctrl+S) |
| `useSaveShortcut` | Convenience wrapper for Ctrl+S |

---

## State Management

This application uses **local state** with React Hook Form - no global state management library is needed.

```
┌─────────────────────────────────────────────────────────────┐
│                         App.tsx                              │
│                                                              │
│   useResumeForm() → form, fieldArrays, helpers              │
│   usePdfGeneration() → pdfUrl, isLoading, error, generate   │
│   useSaveShortcut() → registers Ctrl+S                      │
│                                                              │
│   Form state is passed DOWN via props                        │
│   PDF state is passed DOWN via props                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Styling Strategy

1. **Tailwind CSS** - Utility-first styling
2. **shadcn/ui** - Pre-built accessible components
3. **Custom CSS** - Minimal, only for scrollbars and PDF canvas

---

## Build & Development

```bash
# Development
npm run dev          # Start dev server at localhost:5173

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Type Checking
npx tsc --noEmit     # Check types without emitting
```
