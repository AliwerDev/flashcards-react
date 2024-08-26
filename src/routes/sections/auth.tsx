import { Outlet } from "react-router-dom";

import { GuestGuard } from "src/auth/guard";
import AuthLayout from "src/layouts/auth/layout";

// ----------------------------------------------------------------------

// JWT
import RegisterPage from "src/pages/auth/register/page";
import LoginPage from "src/pages/auth/login/page";

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: "auth",
    element: (
      <GuestGuard>
        <AuthLayout>
          <Outlet />
        </AuthLayout>
      </GuestGuard>
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
