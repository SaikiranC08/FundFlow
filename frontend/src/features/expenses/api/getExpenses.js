export async function getExpenses(page = 0, size = 5) {

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    const accessToken = localStorage.getItem("access_token");

    try {

        const response = await fetch(
          `${baseUrl}/expense/v1/expenses?page=${page}&size=${size}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              
            },
          }
        );

        const data = await response.json();

        return {
            expenses: data.data,
            pagination: data.pagination
        };

    } catch (error) {

        console.error("Error fetching expenses:", error);

        throw new Error("Failed to fetch expenses");
    }
}