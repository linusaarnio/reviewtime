import { useLoaderData } from "react-router-dom";
import { PullRequestList } from "../components/PullRequestList";
import { PullRequestOverview } from "../components/PullRequestListItem";

interface Data {
  pullRequests: PullRequestOverview[];
}

export const toReviewLoader: () => Promise<Data> = async () => {
  return {
    pullRequests: [
      {
        title: "Cool new feature",
        url: "#",
        repository: "fresh_application",
        participantName: "linusaarnio",
        participantAvatarUrl:
          "https://avatars.githubusercontent.com/u/42450444?v=4",
        reviewDue: new Date(),
      },
      {
        title: "Another funky feature",
        url: "#",
        repository: "legacy_application",
        participantName: "linusaarnio",
        participantAvatarUrl:
          "https://avatars.githubusercontent.com/u/42450444?v=4",
        reviewDue: new Date(2022, 11, 26, 10),
      },
    ],
  };
};

const ToReviewPage = () => {
  const data = useLoaderData() as Data;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md mt-5">
      <PullRequestList pullRequests={data.pullRequests} />
    </div>
  );
};

export default ToReviewPage;
