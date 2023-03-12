import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";

import HomePage, { homeLoader } from "./routes/home";
import ToReviewPage, { toReviewLoader } from "./routes/to-review";
import ErrorPage from "./routes/error";
import AuthenticatedRoot, { authenticatedRootLoader } from "./routes/root";
import YourPrsPage, { yourPrsLoader } from "./routes/your-prs";
import LoginPage, { loginLoader } from "./routes/login";

import { BackendApi, LoggedInUserResponse } from "./generated";
import React, { useState } from "react";
import Logout from "./routes/logout";

const createRouter = (api: BackendApi) => {
  return createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
      loader: () => loginLoader(api),
    },
    {
      path: "/oauth/callback",
      element: <Navigate to={"/"} />,
      loader: async ({ request }) => {
        const url = new URL(request.url);
        return api.github.authorizationCallback(
          url.searchParams.get("state") as string,
          url.searchParams.get("code") as string
        );
      },
    },
    {
      path: "/logout",
      loader: async () => {
        await api.github.logout();
      },
      element: <Logout />,
    },
    {
      path: "/",
      errorElement: <ErrorPage />,
      loader: () => authenticatedRootLoader(api),
      element: <AuthenticatedRoot />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          loader: () => homeLoader(api),
        },
        {
          path: "/to-review",
          element: <ToReviewPage />,
          loader: () => toReviewLoader(api),
        },
        {
          path: "/your-prs",
          element: <YourPrsPage />,
          loader: () => yourPrsLoader(api),
        },
      ],
    },
  ]);
};

export default function App() {
  const router = createRouter(
    new BackendApi({
      BASE: process.env.REACT_APP_BACKEND_URL,
      CREDENTIALS: "include",
      WITH_CREDENTIALS: true,
    })
  );

  return <RouterProvider router={router} />;
}
