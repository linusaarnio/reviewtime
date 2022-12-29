import { ClockIcon, ClipboardDocumentListIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { useLoaderData } from "react-router-dom";
import { OverviewCardContent } from "../components/OverviewCard";
import OverviewCardRow from "../components/OverviewCardRow";

interface Data {
  waitingFromOthers: number;
  waitingFromMe: number;
  nextDueInHours: number;
}

export const homeLoader: () => Promise<Data> = async () => {
  return { waitingFromOthers: 4, waitingFromMe: 2, nextDueInHours: 1 };
};

const HomePage = () => {
  const data = useLoaderData() as Data;
  const cards: OverviewCardContent[] = [
    {
      title: "Waiting for review from you",
      href: "to-review",
      icon: ClipboardDocumentListIcon,
      body: `${data.waitingFromMe} Pull Requests`,
    },
    { title: "Next review due in", href: "#", icon: ClockIcon, body: `${data.nextDueInHours} hour` },
    {
      title: "Waiting for review from others",
      href: "#",
      icon: CodeBracketIcon,
      body: `${data.waitingFromOthers} Pull Requests`,
    },
  ];

  return (
    <div>
      <div className="mt-8">
        <OverviewCardRow cards={cards} />
      </div>
    </div>
  );
};

export default HomePage;
