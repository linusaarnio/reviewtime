import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage, { homeLoader } from "./routes/home";
import ToReviewPage, { toReviewLoader } from "./routes/to-review";
import Root, { rootLoader } from "./routes/root";
import YourPrsPage, { yourPrsLoader } from "./routes/your-prs";
import LoginPage, { loginLoader } from "./routes/login";
import LoginCallBackPage, { loginCallbackLoader } from "./routes/login-callback";

import { BackendApi } from "./generated";

const createRouter = (api: BackendApi) => {
  return createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
      loader: () => loginLoader(api),
    },
    {
      path: "/oauth/callback",
      element: <LoginCallBackPage />,
      loader: ({ request }) => {
        const url = new URL(request.url);
        return loginCallbackLoader(
          api,
          url.searchParams.get("state") as string,
          url.searchParams.get("code") as string
        );
      },
    },
    {
      path: "/",
      element: <Root />,
      loader: rootLoader,
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

export default function App() {
  const router = createRouter(new BackendApi({ BASE: process.env.REACT_APP_BACKEND_URL, CREDENTIALS: "include", WITH_CREDENTIALS: true }));

  return <RouterProvider router={router} />;
}
