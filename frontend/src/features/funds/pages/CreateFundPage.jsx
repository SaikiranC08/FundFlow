import {
  useNavigate
} from "react-router-dom";

import FundForm
from "../components/FundForm";

import {
  createFund
} from "../api/createFund";

function CreateFundPage() {

  const navigate =
    useNavigate();

  async function handleCreate(
    formData
  ) {

    try {

      await createFund(
        formData
      );

      navigate("/funds");

    } catch (error) {

  alert(error.message);

  console.error(error);
}
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
          Create Fund
        </h1>

        <p
          className="
            text-gray-500
            mb-8
          "
        >
          Track entrusted money
        </p>

        <FundForm
          onSubmit={handleCreate}
        />

      </div>

    </div>
  );
}

export default CreateFundPage;