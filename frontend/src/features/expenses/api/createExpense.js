import { v4 as uuidv4 } from "uuid";

function getTokenPayload(token) {
  try {
    const payload = token.split(".")[1];
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload);

    return JSON.parse(decodedPayload);
  } catch {
    return {};
  }
}

function getCurrentUsername(accessToken) {
  const tokenPayload = getTokenPayload(accessToken);

  return (
    tokenPayload.username ||
    tokenPayload.userName ||
    tokenPayload.sub ||
    tokenPayload.name ||
    localStorage.getItem("username") ||
    localStorage.getItem("userName") ||
    localStorage.getItem("userId") ||
    ""
  );
}

export async function createExpense(expenseData) {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const accessToken =
    localStorage.getItem("access_token");

  const currentUsername = getCurrentUsername(accessToken);

  const idempotencyKey = uuidv4();

  const payload = {

  amount: Number(expenseData.amount),

  userId: currentUsername,

  currencyType: "INR",

  date: expenseData.date,

  categoryId: Number(
    expenseData.categoryId
  ),

  ownerName:

    expenseData.ownerType === "SELF"
      ? currentUsername
      : expenseData.ownerName,

  ownerType: expenseData.ownerType,

  description: expenseData.description
};

  const response = await fetch(

    `${baseUrl}/expense/v1/expenses`,

    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${accessToken}`,

        "Idempotency-Key": idempotencyKey

      },

      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {

    throw new Error("Failed to create expense");
  }

  return await response.json();
}
