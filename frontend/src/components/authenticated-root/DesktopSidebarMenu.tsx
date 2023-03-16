import { Location } from "react-router-dom";
import { NavigationItemWithIcon } from "../../routes/root";
import { classNames } from "../../utils";

interface Props {
  location: Location;
  navigation: NavigationItemWithIcon[];
}

export const DesktopSidebarMenu = ({ location, navigation }: Props) => {
  return (
    <>
      <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
        <div className="flex flex-shrink-0 items-center px-4">
          <img className="h-10 w-auto" src="/logo.webp" alt="reviewtime" />
        </div>
        <div className="mt-5 flex flex-grow flex-col">
          <nav className="flex-1 space-y-1 px-2 pb-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.href === location.pathname
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                )}
              >
                <item.icon
                  className={classNames(
                    item.href === location.pathname
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};
