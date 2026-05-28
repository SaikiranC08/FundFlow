export async function getFilteredExpenses({
  range,
  startDate,
  endDate
}) {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const accessToken =
    localStorage.getItem("access_token");

  const params =
    new URLSearchParams({
      range
    });

  if (startDate && endDate) {

    params.set("startDate", startDate);
    params.set("endDate", endDate);
  }

  const response =
    await fetch(
      `${baseUrl}/expense/v1/expenses/filter?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

  if (!response.ok) {

    throw new Error("Failed to fetch filtered expenses");
  }

  const data =
    await response.json();

  if (Array.isArray(data)) {

    return data;
  }

  if (Array.isArray(data.data)) {

    return data.data;
  }

  if (Array.isArray(data.expenses)) {

    return data.expenses;
  }

  return [];
}
