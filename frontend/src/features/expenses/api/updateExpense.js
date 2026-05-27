import { v4 as uuidv4 } from "uuid";

export async function updateExpense(
  expenseId,
  expenseData
) {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL;

  const accessToken =
    localStorage.getItem("access_token");

  const payload = {

    amount: Number(expenseData.amount),

    userId: expenseData.userId,

    currencyType: "INR",

    date: expenseData.date,

    categoryId: Number(
      expenseData.categoryId
    ),

    ownerName:
      expenseData.ownerType === "SELF"
        ? "SELF"
        : expenseData.ownerName,

    ownerType: expenseData.ownerType,

    description: expenseData.description
  };

  const response = await fetch(

    `${baseUrl}/expense/v1/expenses/${expenseId}`,

    {
      method: "PATCH",

      headers: {

        "Content-Type": "application/json",

        Authorization: `Bearer ${accessToken}`,

        "Idempotency-Key": uuidv4()
      },

      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to update expense"
    );
  }

  return await response.json();
}