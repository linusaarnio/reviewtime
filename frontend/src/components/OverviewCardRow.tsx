import OverviewCard, { OverviewCardContent } from "./OverviewCard";

interface Props {
  cards: OverviewCardContent[];
}

const OverviewCardRow = ({ cards }: Props) => {
  return (
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <OverviewCard content={card} />
        ))}
      </div>
  );
};

export default OverviewCardRow;
