import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <Search className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />

      <h1 className="mt-6 text-[9rem] leading-none font-black tracking-tighter text-indigo-500 dark:text-indigo-400">
        4<span className="inline-block rotate-12 opacity-70">0</span>4
      </h1>

      <h2 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Page not found
      </h2>

      <p className="mt-2 max-w-sm text-center text-gray-500 dark:text-gray-400">
        Sorry, we couldn't find the page you're looking for. It might have been
        moved or doesn't exist.
      </p>

      <Link to="/" className="mt-8">
        <Button variant="default" size="lg" className="gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
