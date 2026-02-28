import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout";
import { templates } from "./templateConfig";
import { TemplateCard } from "./TemplateCard";

export function TemplateSelectionPage() {
  const navigate = useNavigate();

  function selectTemplate(templateId: string) {
    navigate("/build-resume", { state: { templateId } });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex flex-1 items-start justify-center px-6 py-12">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Select a Template
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Pick a design that best fits your style. You can always change it
              later.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={selectTemplate}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
