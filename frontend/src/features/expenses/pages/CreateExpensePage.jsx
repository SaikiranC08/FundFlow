import { useNavigate } from "react-router-dom";

import ExpenseForm from "../components/ExpenseForm";

import { createExpense } from "../api/createExpense";

function CreateExpensePage() {

  const navigate = useNavigate();

  async function handleCreateExpense(formData) {

    try {

      await createExpense(formData);

      navigate("/expenses");

    } catch (error) {

      console.error(error);
    }
  }

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Create Expense
        </h1>

        <p className="text-gray-500 mb-8">
          Add a new expense
        </p>

        <ExpenseForm
          onSubmit={handleCreateExpense}
        />

      </div>

    </div>
  );
}

export default CreateExpensePage;