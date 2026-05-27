import {
  useEffect,
  useState
} from "react";

import {
  getFunds
} from "../api/getFunds";

import FundsGrid
from "../components/FundsGrid";

import {
  useNavigate
} from "react-router-dom";

function FundsPage() {

  const [funds, setFunds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const navigate = useNavigate();

  useEffect(() => {

    async function fetchFunds() {

      try {

        const response =
          await getFunds();

        setFunds(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    fetchFunds();

  }, []);

  if (loading) {

    return (

      <div className="p-8">

        Loading funds...

      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-gray-50
        p-8
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Funds
          </h1>

          <p className="text-gray-500 mt-1">
            Track entrusted money
          </p>

        </div>

        <button
        onClick={() =>
            navigate("/funds/create")
          }
          className="
            bg-black
            text-white
            px-5 py-3
            rounded-2xl
          "
        >
          + Create Fund
        </button>

      </div>

      <FundsGrid funds={funds} />

    </div>
  );
}

export default FundsPage;