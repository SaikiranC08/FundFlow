import { refreshAccessToken } from "./refreshService";

export async function validateToken() {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    let token =
        localStorage.getItem("access_token");

    if (!token) {

        return false;
    }

    let response = await fetch(
        `${baseUrl}/auth/v1/validate`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    // ACCESS TOKEN INVALID

    if (!response.ok) {

        const refreshed =
            await refreshAccessToken();

        // REFRESH TOKEN ALSO FAILED

        if (!refreshed) {

            localStorage.removeItem(
                "access_token"
            );

            localStorage.removeItem(
                "token"
            );

            return false;
        }

        // GET NEW ACCESS TOKEN

        token =
            localStorage.getItem(
                "access_token"
            );

        // RETRY VALIDATION

        response = await fetch(
            "http://localhost:8000/auth/v1/validate",
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );
    }

    if (response.ok) {

        const username =
            await response.text();

        localStorage.setItem(
            "username",
            username
        );
    }

    return response.ok;
}
