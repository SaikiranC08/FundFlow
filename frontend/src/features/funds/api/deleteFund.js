export async function deleteFund(
  fundId
) {

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL;

  const accessToken =
    localStorage.getItem(
      "access_token"
    );

  const response = await fetch(

    `${baseUrl}/expense/v1/funds/${fundId}`,

    {
      method: "DELETE",

      headers: {

        Authorization:
          `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {

    throw new Error(
      "Failed to delete fund"
    );
  }
}