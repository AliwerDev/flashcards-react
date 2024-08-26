import { Navigate, useRoutes } from "react-router-dom";

import { mainRoutes } from "./main";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { paths } from "../paths";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Navigate to={paths.dashboard.analytics} replace />,
    },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // No match 404
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
