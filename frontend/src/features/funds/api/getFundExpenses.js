export async function getFundExpenses(
  fundId
) {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL;

  const accessToken =
    localStorage.getItem(
      "access_token"
    );

  const response = await fetch(

    `${baseUrl}/expense/v1/fund/${fundId}`,

    {
      method: "GET",

      headers: {

        Authorization:
          `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to fetch expenses"
    );
  }

  return await response.json();
}