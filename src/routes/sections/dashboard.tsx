/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { AuthGuard } from "src/auth/guard";
import { SplashScreen } from "src/components/shared/loading-screen";
// import { storageKey } from "src/config-global";

// ----------------------------------------------------------------------

// LAYOUT
const DashboardLayout = lazy(() => import("src/layouts/dashboard/layout"));

// PAGES
const IndexPage = lazy(() => import("src/pages/dashboard/page"));
const ProfilePage = lazy(() => import("src/pages/dashboard/profile/page"));
const AnalyticsPage = lazy(() => import("src/pages/dashboard/analytics/page"));
const UsersPage = lazy(() => import("src/pages/dashboard/users/page"));
const CardsPage = lazy(() => import("src/pages/dashboard/cards/page"));
const PlayPage = lazy(() => import("src/pages/dashboard/play/page"));
const MainPage = lazy(() => import("src/pages/dashboard/main/page"));

// ----------------------------------------------------------------------

// const lastOpenedPath = localStorage.getItem(storageKey.LAST_PATH);

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<SplashScreen />}>
            <Outlet />
          </Suspense>
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
