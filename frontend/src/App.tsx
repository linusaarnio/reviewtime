import * as React from "react";
import * as ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage, { homeLoader } from "./routes/home";
import ToReviewPage, { toReviewLoader } from "./routes/to-review";
import Root, { rootLoader } from "./routes/root";

const router = createBrowserRouter([
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
    ]
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
