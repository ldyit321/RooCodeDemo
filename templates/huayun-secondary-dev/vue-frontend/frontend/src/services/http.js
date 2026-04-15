function getAccessToken() {
	return window.localStorage.getItem("crowncad_access_token")
}

export async function request(path, options = {}) {
	const response = await fetch(`${window.__CROWNCAD_API_BASE_URL__ || "/api"}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
			...(options.headers || {}),
		},
	})

	const payload = await response.json()
	if (!response.ok || payload.code !== 0) {
		throw new Error(payload.message || "CrownCAD request failed.")
	}

	return payload.data
}
