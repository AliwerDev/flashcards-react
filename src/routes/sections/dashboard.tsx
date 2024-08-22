/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Outlet } from "react-router-dom";

import { AuthGuard } from "src/auth/guard";

// ----------------------------------------------------------------------

// LAYOUT
const DashboardLayout = lazy(() => import("src/layouts/dashboard/layout"));

// PAGES
import IndexPage from "src/pages/dashboard/page";
import ProfilePage from "src/pages/dashboard/profile/page";
import AnalyticsPage from "src/pages/dashboard/analytics/page";
import UsersPage from "src/pages/dashboard/users/page";
import CardsPage from "src/pages/dashboard/cards/page";
import PlayPage from "src/pages/dashboard/play/page";
import MainPage from "src/pages/dashboard/main/page";

// ----------------------------------------------------------------------

// const lastOpenedPath = localStorage.getItem(storageKey.LAST_PATH);

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: ":categoryId/cards",
        element: <CardsPage />,
      },
      {
        path: ":categoryId/main",
        element: <MainPage />,
      },
      {
        path: ":categoryId/play",
        element: <PlayPage />,
      },
    ],
  },
];
