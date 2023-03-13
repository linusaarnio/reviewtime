import { useLoaderData } from "react-router-dom";
import { PullRequestList } from "../components/PullRequestList";
import { PullRequestOverview } from "../components/PullRequestListItem";
import { BackendApi } from "../generated";

interface Data {
  pullRequests: PullRequestOverview[];
}

export const toReviewLoader: (api: BackendApi) => Promise<Data> = async (
  api: BackendApi
) => {
  const prResponse = await api.pullrequest.getReviewRequestedFromUser();
  const pullRequests: PullRequestOverview[] = prResponse.pullRequests.map(
    (pr) => ({
      participantAvatarUrl: pr.author.avatarUrl,
      participantName: pr.author.login,
      repository: pr.repository.name,
      title: pr.title,
      reviewDue: new Date(pr.reviewDueAt),
      url: pr.url,
    })
  );
  return { pullRequests };
};

const ToReviewPage = () => {
  const data = useLoaderData() as Data;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md mt-5">
      <PullRequestList
        pullRequests={data.pullRequests.sort(
          (a, b) => a.reviewDue.valueOf() - b.reviewDue.valueOf()
        )}
      />
    </div>
  );
};

export default ToReviewPage;
