import { Fragment, useEffect, useState } from "react";
import { HomeIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import { BackendApi, LoggedInUserResponse } from "../generated";
import { TopBar } from "../components/authenticated-root/TopBar";
import { SidebarMenu } from "../components/authenticated-root/SidebarMenu";

export interface NavigationItem {
  name: string;
  href: string;
}

export interface NavigationItemWithIcon extends NavigationItem {
  icon: (props: any) => JSX.Element;
}

const sidebarNavigation: NavigationItemWithIcon[] = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "To Review", href: "/to-review", icon: UsersIcon },
  { name: "Your PR:s", href: "/your-prs", icon: UserIcon },
];

const userDropdownNavigation: NavigationItem[] = [
  { name: "Settings", href: "/settings" },
  { name: "Sign out", href: "/logout" },
];

export const authenticatedRootLoader: (
  api: BackendApi
) => Promise<LoggedInUserResponse | undefined> = async (api) => {
  const existingUser = localStorage.getItem("user");
  if (existingUser !== null) {
    return JSON.parse(existingUser);
  }
  return api.user.getLoggedInUser().then((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  });
};

export default function AuthenticatedRoot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerText, setHeaderText] = useState("");
  let location = useLocation();
  const user = useLoaderData() as LoggedInUserResponse;

  useEffect(() => {
    const currentPage = sidebarNavigation.find(
      (page) => page.href === location.pathname
    );
    if (currentPage === undefined) {
      setHeaderText("");
    } else {
      setHeaderText(currentPage.name);
    }
  }, [location]);

  if (user === undefined) {
    return <div />;
  }

  return (
    <>
      <SidebarMenu
        location={location}
        navigation={sidebarNavigation}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="md:pl-64">
        <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
          <TopBar
            user={user}
            dropdownNavigation={userDropdownNavigation}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1">
            <div className="py-6">
              <div className="px-4 sm:px-6 md:px-0">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {headerText}
                </h1>
              </div>
              <div className="px-4 sm:px-6 md:px-0">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
