# Interfaces Directory

This directory contains all TypeScript interfaces and types used throughout the Resume Builder application, organized by domain and purpose.

## Directory Structure

```
interfaces/
├── domain/              # Business domain models
│   ├── resume.ts        # Resume-related data interfaces
│   └── index.ts         # Domain exports
│
├── components/          # Component prop interfaces
│   ├── form.ts          # Form component props
│   ├── layout.ts        # Layout component props
│   ├── preview.ts       # Preview component props
│   └── index.ts         # Component exports
│
├── api/                 # API-related types
│   ├── pdf.ts           # PDF generation API interfaces
│   └── index.ts         # API exports
│
├── hooks/               # Hook-related types
│   ├── keyboard.ts      # Keyboard shortcut interfaces
│   └── index.ts         # Hook exports
│
├── index.ts             # Main export (re-exports all interfaces)
└── README.md            # This file
```

## Usage

Import interfaces from the centralized location:

```typescript
// Import from main index (recommended)
import type { ResumeData, HeaderProps, PdfPreviewProps } from "@/interfaces";

// Or import from specific domain
import type { ResumeData } from "@/interfaces/domain";
import type { HeaderProps } from "@/interfaces/components";
```

## Categories

### 1. Domain Interfaces (`domain/`)

Business domain models that represent core data structures:

- **resume.ts**: Resume data models
  - `PersonalInfo` - Personal information
  - `Experience` - Work experience
  - `Education` - Educational background
  - `Project` - Project details
  - `ProfileLinks` - Social/professional profile links
  - `Skills` - Technical skills
  - `ResumeData` - Complete resume structure

### 2. Component Interfaces (`components/`)

Props interfaces for React components:

- **form.ts**: Form component props
  - `FormSectionProps`
  - `FormRowProps`
  - `FormFieldProps`
  - `PersonalInfoFormProps`
  - `ExperienceFormProps`
  - `EducationFormProps`
  - `ProjectsFormProps`
  - `ProfileLinksFormProps`
  - `SkillsFormProps`

- **layout.ts**: Layout component props
  - `HeaderProps`
  - `SplitPaneProps`
  - `ResumeFormPanelProps`
  - `PreviewPanelProps`
  - `ResumeBuilderLayoutProps`
  - `ResumeBuilderState`

- **preview.ts**: Preview component props
  - `PdfPreviewProps`

### 3. API Interfaces (`api/`)

Types for API communication:

- **pdf.ts**: PDF generation API
  - `GeneratePdfResponse`
  - `ApiErrorInterface`

### 4. Hook Interfaces (`hooks/`)

Types for custom React hooks:

- **keyboard.ts**: Keyboard shortcuts
  - `ShortcutOptions`

## Best Practices

1. **Always use type imports** for interfaces:
   ```typescript
   import type { MyInterface } from "@/interfaces";
   ```

2. **Keep interfaces close to their domain** - organize by feature/domain, not by type

3. **Use descriptive names** - e.g., `HeaderProps` instead of just `Props`

4. **Document complex interfaces** - add JSDoc comments for clarity

5. **Re-export through index files** - maintain clean barrel exports

## Migration Notes

The old `src/types/` directory is deprecated and now re-exports from `src/interfaces/` for backward compatibility. All new code should import from `@/interfaces`.

## Benefits

✅ **Centralized** - Single source of truth for all types  
✅ **Organized** - Clear categorization by domain  
✅ **Discoverable** - Easy to find interface definitions  
✅ **Maintainable** - Updates in one place affect entire app  
✅ **Scalable** - Easy to add new interface categories  
✅ **Type-safe** - Consistent types across the application
