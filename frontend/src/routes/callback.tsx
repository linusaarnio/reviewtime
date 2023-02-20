import { Navigate, useLoaderData } from "react-router-dom";
import { LoggedInUserResponse } from "../generated";

type Props = {
  setUser: (user: LoggedInUserResponse) => void;
};

const Callback = ({ setUser }: Props) => {
  return <Navigate to={"/"} />;
};

export default Callback;
