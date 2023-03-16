import { formatDistanceToNow } from "date-fns";
import { classNames } from "../utils";

interface Props {
  dueAt: Date;
  deadlineWarningAt: Date;
}

const OverdueWarningPill = ({ dueAt, deadlineWarningAt }: Props) => {
  const color =
    dueAt.valueOf() <= Date.now()
      ? "bg-red-100 text-red-800"
      : deadlineWarningAt.valueOf() <= Date.now()
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
        {dueAt.valueOf() > Date.now()
          ? `Due in ${formatDistanceToNow(dueAt)}`
          : "Overdue"}
      </p>
    </div>
  );
};

export default OverdueWarningPill;
