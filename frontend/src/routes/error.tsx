import { useRouteError } from "react-router-dom";
import { ApiError } from "../generated";
import Logout from "./logout";

const ErrorPage = () => {
  const error = useRouteError();
  if (error instanceof ApiError && error.status === 401) {
    return <Logout />;
  }
  return <div>Shit hit the fan! Something is wrong with this app.</div>;
};

export default ErrorPage;
