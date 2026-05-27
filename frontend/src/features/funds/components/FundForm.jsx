import {
  useState
} from "react";

function FundForm({

  onSubmit,

  initialData = {},

  buttonText = "Create Fund"

}) {

  const [formData, setFormData] =
    useState({

      amountReceived:
        initialData.amountReceived || "",

      ownerName:
        initialData.ownerName || "",

      givenDate:
        initialData.givenDate || ""
    });

  function handleChange(event) {

    const {
      name,
      value
    } = event.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value
    }));
  }

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    await onSubmit(formData);
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        p-8
        rounded-3xl
        shadow-sm
        border border-gray-100
        space-y-6
      "
    >

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Owner Name
        </label>

        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder="Brother / Family / Friend"
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
          "
          required
        />

      </div>

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Amount Received
        </label>

        <input
          type="number"
          name="amountReceived"
          value={formData.amountReceived}
          onChange={handleChange}
          placeholder="Enter amount"
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
          "
          required
        />

      </div>

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Given Date
        </label>

        <input
          type="date"
          name="givenDate"
          value={formData.givenDate}
          onChange={handleChange}
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
          "
          required
        />

      </div>

      <button
        type="submit"
        className="
          w-full
          bg-black
          hover:opacity-90
          text-white
          py-3
          rounded-xl
          transition
        "
      >
        {buttonText}
      </button>

    </form>
  );
}

export default FundForm;