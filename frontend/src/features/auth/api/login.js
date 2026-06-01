export async function login(formData) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const response = await fetch(`${baseUrl}/auth/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  if (response.ok) {
    const data = await response.json();

    // storing data in local storage
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", formData.username);
  } else {
    throw new Error("login failed: " + response.statusText);
  }
}
