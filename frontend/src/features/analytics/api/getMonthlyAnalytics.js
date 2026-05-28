export async function getMonthlyAnalytics() {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  const accessToken =
    localStorage.getItem("access_token");

  const response = await fetch(
    `${baseUrl}/expense/v1/analytics/monthly`,
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
      "Failed to fetch monthly analytics"
    );
  }

  return await response.json();
}
