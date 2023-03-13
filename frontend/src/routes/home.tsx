import {
  ClockIcon,
  ClipboardDocumentListIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";
import { useLoaderData } from "react-router-dom";
import OverdueWarningPill from "../components/OverdueWarningPill";
import { OverviewCardContent } from "../components/OverviewCard";
import OverviewCardRow from "../components/OverviewCardRow";
import { BackendApi, UserOverviewResponse } from "../generated";

export const homeLoader: (
  api: BackendApi
) => Promise<UserOverviewResponse> = async (api) => {
  return api.pullrequest.getOverview();
};

const HomePage = () => {
  const data = useLoaderData() as UserOverviewResponse;
  const cards: OverviewCardContent[] = [
    {
      title: "Waiting for review from you",
      href: "to-review",
      icon: ClipboardDocumentListIcon,
      body: `${data.waitingForUser} Pull Requests`,
    },
    {
      title: "Waiting for review from others",
      href: "your-prs",
      icon: CodeBracketIcon,
      body: `${data.waitingForOthers} Pull Requests`,
    },
  ];
  if (data.nextReviewDue !== undefined) {
    cards.push({
      title: "Next review",
      href: "to-review",
      icon: ClockIcon,
      body: (
        <OverdueWarningPill
          date={new Date(data.nextReviewDue.reviewDueAt)}
          soonDueIntervalMilliseconds={7200000}
        />
      ),
    });
  }

  return (
    <div>
      <div className="mt-8">
        <OverviewCardRow cards={cards} />
      </div>
    </div>
  );
};

export default HomePage;
