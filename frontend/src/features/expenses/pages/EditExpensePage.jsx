import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import ExpenseForm
from "../components/ExpenseForm";

import {
  getExpenseById
} from "../api/getExpenseById";

import {
  updateExpense
} from "../api/updateExpense";

function EditExpensePage() {

  const { expenseId } = useParams();

  const navigate = useNavigate();

  const [expense, setExpense] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function fetchExpense() {

      try {

        const data =
          await getExpenseById(expenseId);

        setExpense({

          amount: data.amount,

          date: data.date,

          categoryId:
            data.categoryId ||

            data.category?.id,

          ownerType: data.ownerType,

          ownerName: data.ownerName,

          description: data.description
        });

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    fetchExpense();

  }, [expenseId]);

  async function handleUpdate(
    formData
  ) {

    try {

      await updateExpense(
        expenseId,
        formData
      );

      navigate("/expenses");

    } catch (error) {

      console.error(error);
    }
  }

  if (loading) {

    return (

      <div className="p-8">

        Loading expense...

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
          Edit Expense
        </h1>

        <p
          className="
            text-gray-500
            mb-8
          "
        >
          Update your expense
        </p>

        <ExpenseForm
          initialData={expense}
          onSubmit={handleUpdate}
          buttonText="Update Expense"
        />

      </div>

    </div>
  );
}

export default EditExpensePage;