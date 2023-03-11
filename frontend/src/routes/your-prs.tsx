import { useLoaderData } from "react-router-dom";
import { PullRequestList } from "../components/PullRequestList";
import { PullRequestOverview } from "../components/PullRequestListItem";
import { AuthoredPullRequest, BackendApi } from "../generated";

interface Data {
  pullRequests: PullRequestOverview[];
}

export const yourPrsLoader: (api: BackendApi) => Promise<Data> = async (
  api
) => {
  const prResponse = await api.pullrequest.getAuthoredByUser();
  const pullRequests: PullRequestOverview[] = prResponse.pullRequests.flatMap(
    (pr) => getOnePrOverviewPerReviewRequest(pr)
  );
  return { pullRequests };
};

const getOnePrOverviewPerReviewRequest: (
  pr: AuthoredPullRequest
) => PullRequestOverview[] = (pr) => {
  return pr.reviewRequests.map((reviewRequest) => ({
    title: pr.title,
    url: pr.url,
    repository: pr.repository.name,
    participantAvatarUrl: reviewRequest.reviewer.avatarUrl,
    participantName: reviewRequest.reviewer.login,
    reviewDue: new Date(reviewRequest.dueAt),
  }));
};

const YourPrsPage = () => {
  const data = useLoaderData() as Data;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md mt-5">
      <PullRequestList pullRequests={data.pullRequests} />
    </div>
  );
};

export default YourPrsPage;
