import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import HomePage, { homeLoader } from "./routes/home";
import ToReviewPage, { toReviewLoader } from "./routes/to-review";
import AuthenticatedRoot, { authenticatedRootLoader } from "./routes/root";
import YourPrsPage, { yourPrsLoader } from "./routes/your-prs";
import LoginPage, { loginLoader } from "./routes/login";

import { BackendApi, LoggedInUserResponse } from "./generated";
import React, { useState } from "react";
import Logout from "./routes/logout";
import Callback from "./routes/callback";

const createRouter = (
  api: BackendApi,
  setUser: (response: LoggedInUserResponse | undefined) => void
) => {
  return createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
      loader: () => loginLoader(api),
    },
    {
      path: "/oauth/callback",
      element: <Callback setUser={setUser} />,
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
      loader: () => {
        api.github.logout();
      },
      element: <Logout />,
    },
    {
      path: "/",
      element: <AuthenticatedRoot api={api} />, // TODO set user in element

      children: [
        {
          path: "/",
          element: <HomePage />,
          loader: homeLoader,
        },
        {
          path: "/to-review",
          element: <ToReviewPage />,
          loader: toReviewLoader,
        },
        {
          path: "/your-prs",
          element: <YourPrsPage />,
          loader: yourPrsLoader,
        },
      ],
    },
  ]);
};

export const UserContext = React.createContext<{
  user: LoggedInUserResponse | undefined;
  setUser: (user: LoggedInUserResponse) => void;
  logout: () => void;
}>({ user: undefined, setUser: (user) => {}, logout: () => {} });

export default function App() {
  const [user, setUser] = useState<LoggedInUserResponse>();

  const router = createRouter(
    new BackendApi({
      BASE: process.env.REACT_APP_BACKEND_URL,
      CREDENTIALS: "include",
      WITH_CREDENTIALS: true,
    }),
    setUser
  );

  return (
    <UserContext.Provider
      value={{ user, setUser, logout: () => setUser(undefined) }}
    >
      <RouterProvider router={router} />;
    </UserContext.Provider>
  );
}
