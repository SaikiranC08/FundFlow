import {

  useEffect,

  useState

} from "react";

import {

  useNavigate,

  useParams

} from "react-router-dom";

import FundForm
from "../components/FundForm";

import {
  getFundById
} from "../api/getFundById";

import {
  updateFund
} from "../api/updateFund";

function EditFundPage() {

  const { fundId } =
    useParams();

  const navigate =
    useNavigate();

  const [fund, setFund] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchFund() {

      try {

        const response =
          await getFundById(
            fundId
          );

        setFund(response);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    fetchFund();

  }, [fundId]);

  async function handleUpdate(
    formData
  ) {

    try {

      await updateFund(

        fundId,

        formData
      );

      navigate("/funds");

    } catch (error) {

      alert(error.message);

      console.error(error);
    }
  }

  if (loading) {

    return (
      <div className="p-8">
        Loading...
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

      <div className="max-w-2xl mx-auto">

        <h1
          className="
            text-3xl
            font-bold
            mb-2
          "
        >
          Edit Fund
        </h1>

        <p
          className="
            text-gray-500
            mb-8
          "
        >
          Update fund details
        </p>

        <FundForm

          initialData={fund}

          onSubmit={handleUpdate}

          buttonText="Update Fund"
        />

      </div>

    </div>
  );
}

export default EditFundPage;