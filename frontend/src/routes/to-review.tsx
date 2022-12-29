import { CalendarIcon, FolderIcon, MapPinIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useLoaderData } from "react-router-dom";
import OverdueWarningPill from "../components/OverdueWarningPill";

interface PrInfo {
  title: string;
  url: string;
  repository: string;
  author: string;
  authorAvatarUrl: string;
  reviewDue: Date;
}
interface Data {
  pullRequests: PrInfo[];
}

export const toReviewLoader: () => Promise<Data> = async () => {
  return {
    pullRequests: [
      {
        title: "Cool new feature",
        url: "#",
        repository: "fresh_application",
        author: "linusaarnio",
        authorAvatarUrl: "https://avatars.githubusercontent.com/u/42450444?v=4",
        reviewDue: new Date(),
      },
      {
        title: "Another funky feature",
        url: "#",
        repository: "legacy_application",
        author: "linusaarnio",
        authorAvatarUrl: "https://avatars.githubusercontent.com/u/42450444?v=4",
        reviewDue: new Date(2022, 11, 26, 10),
      },
    ],
  };
};

const ToReviewPage = () => {
  const data = useLoaderData() as Data;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md mt-5">
      <ul className="divide-y divide-gray-200">
        {data.pullRequests.map((pr) => (
          <li key={pr.url}>
            <a href={pr.url} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-indigo-600">{pr.title}</p>
                  <OverdueWarningPill date={pr.reviewDue} soonDueIntervalMilliseconds={7200000} />
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <img
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src={pr.authorAvatarUrl}
                        alt={pr.author}
                      />
                      {pr.author}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <FolderIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      {pr.repository}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <p>
                      <time dateTime={pr.reviewDue.toDateString()}>{format(pr.reviewDue, "yyyy-MM-dd HH:mm")}</time>
                    </p>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToReviewPage;
