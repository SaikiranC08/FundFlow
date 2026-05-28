export async function getCategoryTotals() {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const accessToken =
    localStorage.getItem("access_token");

  const response = await fetch(
    `${baseUrl}/expense/v1/expenses/categories-total`,
    {
      method: "GET",
      headers: {
        Authorization:
          `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to fetch category totals"
    );
  }

  return await response.json();
}
