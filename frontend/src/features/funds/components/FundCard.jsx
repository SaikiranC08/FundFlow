import {
  useNavigate
} from "react-router-dom";

import {
  deleteFund
} from "../api/deleteFund";
function FundCard({ fund }) {

  function getStatusColor(status) {

    switch (status) {

      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "EXHAUSTED":
        return "bg-orange-100 text-orange-700";

      case "CLOSED":

        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const navigate =
  useNavigate();

  async function handleDelete() {

  const confirmed =
    window.confirm(
      "Delete this fund?"
    );

  if (!confirmed) {
    return;
  }

  try {

    await deleteFund(
      fund.fundId
    );

    window.location.reload();

  } catch (error) {

    console.error(error);
  }
}

  return (

    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border border-gray-100
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          mb-5
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          {
              fund.ownerType === "SELF"

                ? "My Wallet"

                : fund.ownerName
            }
        </h2>

        <span
          className={`
            px-3 py-1
            rounded-full
            text-xs
            font-medium
            ${getStatusColor(fund.status)}
          `}
        >
          {fund.status}
        </span>

      </div>

      <div className="space-y-3">

        <div>

          <p className="text-sm text-gray-400">
            Amount Received
          </p>

          <p className="text-2xl font-bold">
            ₹{fund.amountReceived}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-400">
            Remaining Amount
          </p>

          <p
            className="
              text-lg
              font-semibold
            "
          >
            ₹{fund.remainingAmount}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-400">
            Given Date
          </p>

          <p>
            {fund.givenDate}
          </p>

        </div>

      </div>

      <div
        className="
          flex
          gap-3
          mt-6
        "
      >

        <button
        onClick={() =>

              navigate(
                `/funds/${fund.fundId}`
              )
            }
          className="
            text-sm
            text-blue-600
            hover:underline
          "
        >
          View
        </button>

        <button
            onClick={() =>

                navigate(
                  `/funds/edit/${fund.fundId}`
                )
              }
          className="
            text-sm
            text-green-600
            hover:underline
          "
        >
          Edit
        </button>

        <button
        onClick={handleDelete}
          className="
            text-sm
            text-red-600
            hover:underline
          "
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default FundCard;