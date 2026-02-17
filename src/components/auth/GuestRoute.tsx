import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Route guard that redirects authenticated users away from guest-only pages
 * (login, signup, forgot-password) back to the main app.
 *
 * While Firebase is still determining the auth state (`loading === true`),
 * a full-screen spinner is shown to avoid a flash of the wrong page.
 *
 * Usage (in your router config):
 *   <Route element={<GuestRoute />}>
 *     <Route path="/login" element={<LoginPage />} />
 *   </Route>
 */
export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
