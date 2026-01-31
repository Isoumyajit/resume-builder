import { FileText, Download, Github } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderProps {
  onDownload: () => void;
  canDownload: boolean;
  isGenerating: boolean;
}

export function Header({ onDownload, canDownload, isGenerating }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-sm text-gray-500">
              Create professional resumes with LaTeX quality
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Github className="h-5 w-5" />
          </a>

          <Button
            onClick={onDownload}
            disabled={!canDownload || isGenerating}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </header>
  );
}
