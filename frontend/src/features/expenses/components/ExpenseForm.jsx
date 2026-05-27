import { useEffect, useState } from "react";

import { getOwnerNames } from "../api/getOwnerNames";

const categories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Travel" },
  { id: 3, name: "Shopping" },
  { id: 4, name: "Health" },
  { id: 5, name: "Entertainment" },
  { id: 6, name: "Other" },
];

function ExpenseForm({
  onSubmit,
  initialData = {},
  buttonText = "Create Expense"
}){

  const [formData, setFormData] = useState({

  amount:
    initialData.amount || "",

  date:
    initialData.date || "",

  categoryId:
    initialData.categoryId || "",

  ownerType:
    initialData.ownerType || "SELF",

  ownerName:
    initialData.ownerName || "",

  description:
    initialData.description || "",
});

  const [ownerNames, setOwnerNames] = useState([]);

  const [loadingOwners, setLoadingOwners] =
    useState(false);

  useEffect(() => {

    if (formData.ownerType !== "OTHER") {

      setOwnerNames([]);

      return;
    }

    async function fetchOwnerNames() {

      try {

        setLoadingOwners(true);

        const data =
          await getOwnerNames();

        setOwnerNames(data);

      } catch (error) {

        console.error(error);

        setOwnerNames([]);

      } finally {

        setLoadingOwners(false);
      }
    }

    fetchOwnerNames();

  }, [formData.ownerType]);

  function handleChange(event) {

    const { name, value } = event.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

      ...(name === "ownerType"
        ? { ownerName: "" }
        : {})
    }));
  }

  async function handleSubmit(event) {

    event.preventDefault();

    const finalData = {

      ...formData,

      ownerName:

        formData.ownerType === "SELF"
          ? "jack"
          : formData.ownerName
    };

    await onSubmit(finalData);
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

      {/* Amount */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Amount
        </label>

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
            focus:border-green-500
          "
          required
        />

      </div>

      {/* Date */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Date
        </label>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
            focus:border-green-500
          "
          required
        />

      </div>

      {/* Category */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Category
        </label>

        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
            focus:border-green-500
          "
          required
        >

          <option value="">
            Select Category
          </option>

          {categories.map((category) => (

            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>

          ))}

        </select>

      </div>

      {/* Owner Type */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Owner Type
        </label>

        <select
          name="ownerType"
          value={formData.ownerType}
          onChange={handleChange}
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
            focus:border-green-500
          "
          required
        >

          <option value="SELF">
            SELF
          </option>

          <option value="OTHER">
            OTHER
          </option>

        </select>

      </div>

      {/* Owner Name Dropdown */}

      {
        formData.ownerType === "OTHER" && (

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

            <select
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              disabled={loadingOwners}
              className="
                w-full
                border border-gray-200
                rounded-xl
                px-4 py-3
                outline-none
                focus:border-green-500
                disabled:bg-gray-50
              "
              required
            >

              <option value="">

                {
                  loadingOwners
                    ? "Loading owners..."
                    : "Select Owner"
                }

              </option>

              {ownerNames.map((name) => (

                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>

              ))}

            </select>

          </div>
        )
      }

      {/* Description */}

      <div>

        <label
          className="
            block
            mb-2
            text-sm
            font-medium
          "
        >
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Expense description"
          rows="4"
          className="
            w-full
            border border-gray-200
            rounded-xl
            px-4 py-3
            outline-none
            focus:border-green-500
          "
          required
        />

      </div>

      {/* Submit Button */}

      <button
        type="submit"
        className="
          w-full
          bg-green-600
          hover:bg-green-700
          text-white
          py-3
          rounded-xl
          transition
          font-medium
        "
      >
        {buttonText}
      </button>

    </form>
  );
}

export default ExpenseForm;