import { FileText, Download, Github } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onDownload: () => void;
  canDownload: boolean;
  isGenerating: boolean;
}

export function Header({ onDownload, canDownload, isGenerating }: HeaderProps) {
  return (
    <header className="rb-header border-b border-gray-200 bg-white px-6 py-4">
      <div className="rb-header__container flex items-center justify-between">
        <div className="rb-header__brand flex items-center gap-3">
          <div className="rb-header__logo flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="rb-header__info">
            <h1 className="rb-header__title text-xl font-bold text-gray-900">Resume Builder</h1>
            <p className="rb-header__subtitle text-sm text-gray-500">
              Create professional resumes with LaTeX quality
            </p>
          </div>
        </div>

        <div className="rb-header__actions flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rb-header__github-link text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>

          <Button
            onClick={onDownload}
            disabled={!canDownload || isGenerating}
            className="rb-header__download-button gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
