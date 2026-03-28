import {
  FileText,
  Download,
  LogOut,
  ClockIcon,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import type { HeaderProps } from "@/interfaces/components";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplate } from "@/contexts/TemplateContext";
import { templates } from "@/components/templates/templateConfig";

export const SUBTITLE = "Create professional resumes with LaTeX quality";
export const TITLE = "Resume Builder";
export const DOWNLOAD_BUTTON_TEXT = "Download PDF";
export const GENERATE_BUTTON_TEXT = "Generate";
export const GENERATING_BUTTON_TEXT = "Generating...";

function getInitials(displayName: string | null, email: string | null): string {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

function UserAvatar({
  photoURL,
  displayName,
  initials,
  size,
}: {
  photoURL: string | null;
  displayName: string | null;
  initials: string;
  size: "default" | "lg";
}) {
  const fallbackClass =
    size === "lg"
      ? "bg-indigo-600 text-white text-sm font-semibold dark:bg-indigo-500 dark:text-gray-900"
      : "bg-indigo-600 text-white text-xs font-semibold dark:bg-indigo-500 dark:text-gray-900";

  return (
    <Avatar size={size}>
      {photoURL && (
        <AvatarImage src={photoURL} alt={displayName ?? "User avatar"} />
      )}
      <AvatarFallback className={fallbackClass}>{initials}</AvatarFallback>
    </Avatar>
  );
}

export function Header({
  subtitle,
  onGenerate,
  onDownload,
  canDownload,
  isGenerating,
  autoSaveStatus,
}: HeaderProps) {
  const { user, signOut } = useAuth();
  const { templateId, setTemplateId } = useTemplate();
  const [templatePopoverOpen, setTemplatePopoverOpen] = useState(false);
  const location = useLocation();

  const DOWNLOAD_COOLDOWN_MS = 2000;
  const lastDownloadRef = useRef(0);
  const handleDownload = useCallback(() => {
    const now = Date.now();
    if (now - lastDownloadRef.current < DOWNLOAD_COOLDOWN_MS) return;
    lastDownloadRef.current = now;
    onDownload?.();
  }, [onDownload]);

  const isBuildPage = location.pathname === "/build-resume";
  const activeTemplate = templates.find((t) => t.id === templateId);

  const displayName = user?.displayName ?? null;
  const email = user?.email ?? null;
  const photoURL = user?.photoURL ?? null;
  const initials = getInitials(displayName, email);

  const StatusIcon = autoSaveStatus === "Saved" ? Check : ClockIcon;

  return (
    <header className="rb-header border-b border-gray-300 bg-gray-200 px-4 py-2 dark:bg-gray-900 dark:border-gray-700">
      <div className="rb-header__container grid grid-cols-3 items-center">
        <div className="rb-header__brand flex items-center gap-2 justify-self-start">
          <div className="rb-header__logo flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 dark:bg-indigo-500">
            <FileText className="h-4.5 w-4.5 text-white dark:text-gray-900" />
          </div>
          <div className="rb-header__info">
            <h1 className="rb-header__title text-base font-bold leading-tight text-gray-900 dark:text-gray-100">
              {TITLE}
            </h1>
            <p className="rb-header__subtitle text-xs text-gray-500 dark:text-gray-400">
              {subtitle ?? SUBTITLE}
            </p>
          </div>
        </div>

        <div className="justify-self-center">
          {isBuildPage && (
            <Popover
              open={templatePopoverOpen}
              onOpenChange={setTemplatePopoverOpen}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  {activeTemplate && (
                    <activeTemplate.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                  <span>{activeTemplate?.name ?? "Template"}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                sideOffset={8}
                className="w-56 p-1"
              >
                {templates.map((template) => {
                  const Icon = template.icon;
                  const isActive = template.id === templateId;
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setTemplateId(template.id);
                        setTemplatePopoverOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer
                      ${isActive ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`}
                      />
                      <span className="font-medium">{template.name}</span>
                      {isActive && (
                        <Check className="ml-auto h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="rb-header__actions flex items-center gap-2 justify-self-end">
          {isBuildPage && autoSaveStatus && (
            <span
              className={`rb-header__auto-save-status flex items-center gap-2 text-xs
                ${autoSaveStatus === "Saved" ? "text-green-500" : "text-gray-500 dark:text-gray-400"}`}
            >
              <StatusIcon className="h-3 w-3" />
              {autoSaveStatus}
            </span>
          )}
          <ThemeToggle size="sm" />
          {onGenerate && (
            <div className="rb-header__button-group flex overflow-hidden rounded-lg">
              <button
                type="button"
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-gray-900"
              >
                {isGenerating ? GENERATING_BUTTON_TEXT : GENERATE_BUTTON_TEXT}
              </button>
              <div className="w-px bg-indigo-400 dark:bg-indigo-300" />
              <button
                type="button"
                onClick={handleDownload}
                disabled={!canDownload || isGenerating}
                className="flex items-center justify-center bg-indigo-600 px-2.5 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-gray-900"
                aria-label={DOWNLOAD_BUTTON_TEXT}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          )}

          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rb-header__avatar-trigger flex items-center gap-2 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="User menu"
                >
                  <UserAvatar
                    photoURL={photoURL}
                    displayName={displayName}
                    initials={initials}
                    size="default"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={8} className="w-64 p-0">
                <div className="rb-header__user-info flex items-center gap-3 px-4 py-3">
                  <UserAvatar
                    photoURL={photoURL}
                    displayName={displayName}
                    initials={initials}
                    size="lg"
                  />
                  <div className="flex flex-col overflow-hidden">
                    {displayName && (
                      <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {displayName}
                      </span>
                    )}
                    {email && (
                      <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {email}
                      </span>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="p-1">
                  <button
                    type="button"
                    onClick={signOut}
                    className="rb-header__sign-out flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}
