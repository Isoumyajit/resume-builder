import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoggedOutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <LogOut className="h-10 w-10 text-gray-400 dark:text-gray-500" />

      <h1 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        You've been logged out
      </h1>

      <p className="mt-2 max-w-sm text-center text-gray-500 dark:text-gray-400">
        Thanks for using Resume Builder. Sign back in whenever you're ready to
        pick up where you left off.
      </p>

      <Link to="/login" className="mt-8">
        <Button variant="default" size="lg" className="gap-2">
          <LogIn className="h-4 w-4" />
          Back to Login
        </Button>
      </Link>
    </div>
  );
}
