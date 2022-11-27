import OverviewCard, { OverviewCardContent } from "./OverviewCard";

interface Props {
  cards: OverviewCardContent[];
}

const OverviewCardRow = ({ cards }: Props) => {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-medium leading-6 text-gray-900">Overview</h2>
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <OverviewCard content={card} />
        ))}
      </div>
    </div>
  );
};

export default OverviewCardRow;
