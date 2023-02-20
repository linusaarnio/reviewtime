import {
  PullRequestListItem,
  PullRequestOverview,
} from "./PullRequestListItem";

interface Props {
  pullRequests: PullRequestOverview[];
}

export const PullRequestList = ({ pullRequests }: Props) => {
  return (
    <ul className="divide-y divide-gray-200">
      {pullRequests.map((pr) => (
        <PullRequestListItem pullRequest={pr} key={pr.url} />
      ))}
    </ul>
  );
};
