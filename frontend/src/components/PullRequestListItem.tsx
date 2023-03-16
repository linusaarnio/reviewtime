import { CalendarIcon, FolderIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import OverdueWarningPill from "./OverdueWarningPill";

export interface PullRequestOverview {
  title: string;
  url: string;
  repository: string;
  participantName: string;
  participantAvatarUrl: string;
  reviewDue: Date;
  deadlineWarningAt: Date;
}

interface Props {
  pullRequest: PullRequestOverview;
}

export const PullRequestListItem = ({ pullRequest }: Props) => {
  return (
    <li key={pullRequest.url}>
      <a href={pullRequest.url} className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="truncate text-sm font-medium text-indigo-600">
              {pullRequest.title}
            </p>
            <OverdueWarningPill
              dueAt={pullRequest.reviewDue}
              deadlineWarningAt={pullRequest.deadlineWarningAt}
            />
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500">
                <img
                  className="inline-block mr-1.5 h-6 w-6 rounded-full ring-2 ring-white"
                  src={pullRequest.participantAvatarUrl}
                  alt={pullRequest.participantName}
                />
                {pullRequest.participantName}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                <FolderIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                {pullRequest.repository}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <CalendarIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <p>
                <time dateTime={pullRequest.reviewDue.toDateString()}>
                  {format(pullRequest.reviewDue, "yyyy-MM-dd HH:mm")}
                </time>
              </p>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};
