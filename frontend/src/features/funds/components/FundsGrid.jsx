import FundCard from "./FundCard";

function FundsGrid({ funds }) {

  if (funds.length === 0) {

    return (

      <div
        className="
          bg-white
          rounded-3xl
          p-10
          text-center
          border border-gray-100
        "
      >

        <h2
          className="
            text-xl
            font-semibold
            mb-2
          "
        >
          No Funds Found
        </h2>

        <p className="text-gray-500">
          Create your first fund.
        </p>

      </div>
    );
  }

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
    >

      {funds.map((fund) => (

        <FundCard
          key={fund.fundId}
          fund={fund}
        />

      ))}

    </div>
  );
}

export default FundsGrid;