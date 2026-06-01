export async function refreshAccessToken() {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const refreshToken =
        localStorage.getItem("token");

    if (!refreshToken) {

        return false;
    }

    const response = await fetch(
        `${baseUrl}/auth/v1/refreshToken`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                token: refreshToken
            })
        }
    );

    if (!response.ok) {

        return false;
    }

    const data = await response.json();

    localStorage.setItem(
        "access_token",
        data.accessToken
    );

    localStorage.setItem(
        "token",
        data.token
    );

    return true;
}