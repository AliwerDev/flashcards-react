/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Outlet } from "react-router-dom";

// ----------------------------------------------------------------------

const NotFoundPage = lazy(() => import("src/pages/404"));
const TestPage = lazy(() => import("src/pages/test"));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: <Outlet />,
    children: [
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "test",
        element: <TestPage />,
      },
    ],
  },
];
