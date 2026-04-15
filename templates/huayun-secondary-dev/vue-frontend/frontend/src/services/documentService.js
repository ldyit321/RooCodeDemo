import { request } from "./http.js"

export function listDocuments(params = {}) {
	const query = new URLSearchParams()

	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			query.set(key, value)
		}
	})

	const suffix = query.toString() ? `?${query.toString()}` : ""
	return request(`/document${suffix}`, { method: "GET" })
}
