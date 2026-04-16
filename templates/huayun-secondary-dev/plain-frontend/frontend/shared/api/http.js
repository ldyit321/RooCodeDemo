import { getAccessToken } from "../auth/oauth.js"

export function createHttpClient({ baseUrl }) {
	async function request(path, options = {}) {
		const token = getAccessToken()
		const response = await fetch(`${baseUrl}${path}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
				...(options.headers || {}),
			},
		})

		const payload = await response.json()
		if (!response.ok || payload.code !== 0) {
			throw new Error(payload.message || "CrownCAD request failed.")
		}

		return payload.data
	}

	return { request }
}
