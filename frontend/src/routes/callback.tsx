import React from "react";
import { Await, defer, Navigate, useLoaderData } from "react-router-dom";
import { FullPageSpinner } from "../components/FullPageSpinner";
import { BackendApi } from "../generated";

export const callbackLoader = (request: Request, api: BackendApi) => {
  const url = new URL(request.url);
  const callbackResponsePromise = api.github.authorizationCallback(
    url.searchParams.get("state") as string,
    url.searchParams.get("code") as string
  );
  return defer({ callbackResponse: callbackResponsePromise });
};

const Callback = () => {
  const data = useLoaderData() as any;

  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      <Await
        resolve={data.callbackResponse._promise}
        errorElement={<p>Something went wrong on login</p>}
      >
        {(callbackResponse) => (
          <>{callbackResponse.success === true && <Navigate to={"/"} />}</>
        )}
      </Await>
    </React.Suspense>
  );
};

export default Callback;
