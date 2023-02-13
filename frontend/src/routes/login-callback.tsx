import { useLoaderData } from "react-router-dom";
import { AuthorizationCallbackResponse, BackendApi } from "../generated";

export const loginCallbackLoader: (
  api: BackendApi,
  state: string,
  code: string
) => Promise<AuthorizationCallbackResponse> = async (api, state, code) => {
  return api.github.authorizationCallback(state, code);
};

const LoginCallbackPage = () => {
  const data = useLoaderData() as AuthorizationCallbackResponse;

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">ReviewTime</h2>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          ID: {data.id} <br />
          Login: {data.login}
        </div>
      </div>
    </>
  );
};

export default LoginCallbackPage;
