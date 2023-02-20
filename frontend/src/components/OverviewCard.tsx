export interface OverviewCardContent {
  title: string;
  href: string;
  body: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

interface Props {
  content: OverviewCardContent;
}

const OverviewCard = ({ content }: Props) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <content.icon
              className="h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500">
                {content.title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">
                  {content.body}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <a
            href={content.href}
            className="font-medium text-cyan-700 hover:text-cyan-900"
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
