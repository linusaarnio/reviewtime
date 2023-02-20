import { formatDistanceToNow } from "date-fns";
import { classNames } from "../utils";

interface Props {
  date: Date;
  soonDueIntervalMilliseconds: number;
}

const OverdueWarningPill = ({ date, soonDueIntervalMilliseconds }: Props) => {
  const color =
    date.valueOf() <= Date.now()
      ? "bg-red-100 text-red-800"
      : date.valueOf() <= Date.now() + soonDueIntervalMilliseconds
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";

  return (
    <div className="ml-2 flex flex-shrink-0">
      <p
        className={classNames(
          "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
          color
        )}
      >
        {date.valueOf() > Date.now()
          ? `Due in ${formatDistanceToNow(date)}`
          : "Overdue"}
      </p>
    </div>
  );
};

export default OverdueWarningPill;
