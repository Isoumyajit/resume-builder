import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Route guard that redirects unauthenticated users to /login.
 *
 * While Firebase is still determining the auth state (`loading === true`),
 * a full-screen spinner is shown to avoid a flash of the login page.
 *
 * Usage (in your router config):
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/" element={<ResumeBuilderLayout />} />
 *   </Route>
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
