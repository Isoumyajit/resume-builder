import { createContext, useCallback, useContext, useState } from "react";
import { templates } from "@/components/templates/templateConfig";

const STORAGE_KEY = "rb-template-id";
const DEFAULT_TEMPLATE = "classic";

type TemplateContextState = {
  templateId: string;
  setTemplateId: (id: string) => void;
};

const TemplateContext = createContext<TemplateContextState | undefined>(
  undefined,
);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [templateId, setTemplateIdRaw] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_TEMPLATE,
  );

  const setTemplateId = useCallback((id: string) => {
    const valid = templates.some((t) => t.id === id);
    const resolved = valid ? id : DEFAULT_TEMPLATE;
    localStorage.setItem(STORAGE_KEY, resolved);
    setTemplateIdRaw(resolved);
  }, []);

  return (
    <TemplateContext.Provider value={{ templateId, setTemplateId }}>
      {children}
    </TemplateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTemplate() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}
