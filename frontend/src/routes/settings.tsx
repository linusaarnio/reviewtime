import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import NotificationToast from "../components/NotificationToast";
import { BackendApi, SettingsResponse } from "../generated";

export const settingsLoader: (api: BackendApi) => Promise<SettingsResponse> = (
  api
) => {
  return api.user.getUserSettings();
};

export const settingsAction: (
  api: BackendApi,
  request: Request
) => any = async (api, request) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const emailNotificationsEnabled = Boolean(
    formData.get("emailNotificationsEnabled")
  );
  await api.user.updateEmail({ email, emailNotificationsEnabled });
  return { submitted: true };
};

const SettingsPage = () => {
  const existingSettings = useLoaderData() as SettingsResponse;
  const navigate = useNavigate();
  const action = useActionData() as { submitted?: boolean };
  const [showSubmitted, setShowSubmitted] = useState(false);

  useEffect(() => {
    if (action?.submitted) {
      setShowSubmitted(true);
      setTimeout(() => setShowSubmitted(false), 6000);
    }
  }, [action]);

  return (
    <div>
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Settings
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Set your reviewing settings.
            </p>
          </div>
        </div>

        <Form
          method="post"
          id="notification-settings-form"
          className="space-y-6 pt-8 sm:space-y-5 sm:pt-10"
        >
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Notifications
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Choose how you get notified about review requests and approaching
              deadlines.
            </p>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Email address
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={existingSettings.email}
                  className="block w-full max-w-lg rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <div className="pt-6 sm:pt-5">
            <div role="group" aria-labelledby="label-email">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                  <div
                    className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                    id="label-email"
                  >
                    Email notifications
                  </div>
                </div>
                <div className="mt-4 sm:col-span-2 sm:mt-0">
                  <div className="max-w-lg space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="emailNotificationsEnabled"
                          name="emailNotificationsEnabled"
                          type="checkbox"
                          defaultChecked={
                            existingSettings.emailNotificationsEnabled
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label
                          htmlFor="emailNotificationsEnabled"
                          className="font-medium text-gray-900"
                        >
                          Enabled
                        </label>
                        <p className="text-gray-500">
                          Receive emails when review is requested, approaching
                          deadline or is overdue.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-5">
            <div className="flex justify-end gap-x-3">
              <button
                type="button"
                className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => {
                  navigate("/");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </Form>
        <div />
      </div>
      <NotificationToast show={showSubmitted} setShow={setShowSubmitted} />
    </div>
  );
};
export default SettingsPage;
