import {
  BarChart3,
  Plus,
  WalletCards
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

function QuickActions() {

  const navigate =
    useNavigate();

  const actions = [
    {
      title: "Add Expense",
      path: "/expenses",
      icon: Plus,
      iconClass: "bg-green-100 text-green-600"
    },
    {
      title: "Create Fund",
      path: "/funds",
      icon: WalletCards,
      iconClass: "bg-blue-100 text-blue-600"
    },
    {
      title: "View Analytics",
      path: "/analytics",
      icon: BarChart3,
      iconClass: "bg-purple-100 text-purple-600"
    }
  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-4
      "
    >

      {actions.map((action) => {

        const Icon =
          action.icon;

        return (

          <button
            key={action.title}
            onClick={() =>
              navigate(action.path)
            }
            className="
              bg-white
              rounded-2xl
              border border-gray-100
              shadow-sm
              p-4
              flex
              items-center
              gap-4
              text-left
              hover:shadow-md
              hover:-translate-y-0.5
              transition
            "
          >

            <span
              className={`
                w-11 h-11
                rounded-2xl
                flex
                items-center
                justify-center
                shrink-0
                ${action.iconClass}
              `}
            >
              <Icon size={20} strokeWidth={1.9} />
            </span>

            <span className="font-semibold text-gray-900">
              {action.title}
            </span>

          </button>
        );
      })}

    </div>
  );
}

export default QuickActions;
