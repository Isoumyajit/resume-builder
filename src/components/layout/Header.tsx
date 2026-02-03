import { FileText, Download } from "lucide-react";
import { Button } from "../ui/button";
import type { HeaderProps } from "@/interfaces/components";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header({ onDownload, canDownload, isGenerating }: HeaderProps) {
  return (
    <header className="rb-header border-b border-gray-300 bg-gray-200 px-6 py-4 dark:bg-gray-900 dark:border-gray-700">
      <div className="rb-header__container flex items-center justify-between">
        <div className="rb-header__brand flex items-center gap-3">
          <div className="rb-header__logo flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
            <FileText className="h-6 w-6 text-white dark:text-gray-900" />
          </div>
          <div className="rb-header__info">
            <h1 className="rb-header__title text-xl font-bold text-gray-900 dark:text-gray-100">
              Resume Builder
            </h1>
            <p className="rb-header__subtitle text-sm text-gray-500 dark:text-gray-400">
              Create professional resumes with LaTeX quality
            </p>
          </div>
        </div>

        <div className="rb-header__actions flex items-center gap-3">
          <ThemeToggle size="sm" />
          <Button
            onClick={onDownload}
            disabled={!canDownload || isGenerating}
            className="rb-header__download-button gap-2 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
