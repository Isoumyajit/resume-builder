import { FileText, Download, LogOut } from "lucide-react";
import { Button } from "../ui/button";
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

export const SUBTITLE = "Create professional resumes with LaTeX quality";
export const TITLE = "Resume Builder";
export const DOWNLOAD_BUTTON_TEXT = "Download PDF";

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

export function Header({ onDownload, canDownload, isGenerating }: HeaderProps) {
  const { user, signOut } = useAuth();

  const displayName = user?.displayName ?? null;
  const email = user?.email ?? null;
  const photoURL = user?.photoURL ?? null;
  const initials = getInitials(displayName, email);

  return (
    <header className="rb-header border-b border-gray-300 bg-gray-200 px-6 py-4 dark:bg-gray-900 dark:border-gray-700">
      <div className="rb-header__container flex items-center justify-between">
        <div className="rb-header__brand flex items-center gap-3">
          <div className="rb-header__logo flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
            <FileText className="h-6 w-6 text-white dark:text-gray-900" />
          </div>
          <div className="rb-header__info">
            <h1 className="rb-header__title text-xl font-bold text-gray-900 dark:text-gray-100">
              {TITLE}
            </h1>
            <p className="rb-header__subtitle text-sm text-gray-500 dark:text-gray-400">
              {SUBTITLE}
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
            {DOWNLOAD_BUTTON_TEXT}
          </Button>

          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rb-header__avatar-trigger flex items-center gap-2 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="User menu"
                >
                  <Avatar size="default">
                    {photoURL && (
                      <AvatarImage
                        src={photoURL}
                        alt={displayName ?? "User avatar"}
                      />
                    )}
                    <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold dark:bg-indigo-500 dark:text-gray-900">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={8} className="w-64 p-0">
                <div className="rb-header__user-info flex items-center gap-3 px-4 py-3">
                  <Avatar size="lg">
                    {photoURL && (
                      <AvatarImage
                        src={photoURL}
                        alt={displayName ?? "User avatar"}
                      />
                    )}
                    <AvatarFallback className="bg-indigo-600 text-white text-sm font-semibold dark:bg-indigo-500 dark:text-gray-900">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
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
