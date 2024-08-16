/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";

import { GuestGuard } from "src/auth/guard";
import { SplashScreen } from "src/components/shared/loading-screen";
import AuthLayout from "src/layouts/auth/layout";

// ----------------------------------------------------------------------

// JWT
const RegisterPage = lazy(() => import("src/pages/auth/register/page"));
const LoginPage = lazy(() => import("src/pages/auth/login/page"));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: "auth",
    element: (
      <Suspense fallback={<SplashScreen />}>
        <GuestGuard>
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        </GuestGuard>
      </Suspense>
    ),
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
];
