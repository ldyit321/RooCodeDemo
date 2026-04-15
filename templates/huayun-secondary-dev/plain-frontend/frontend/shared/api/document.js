export function createDocumentApi(httpClient) {
	return {
		listDocuments(params = {}) {
			const query = new URLSearchParams()
			Object.entries(params).forEach(([key, value]) => {
				if (value) {
					query.set(key, value)
				}
			})

			const suffix = query.toString() ? `?${query.toString()}` : ""
			return httpClient.request(`/document${suffix}`, { method: "GET" })
		},
		createDocument(body) {
			return httpClient.request("/document", {
				method: "POST",
				body: JSON.stringify(body),
			})
		},
	}
}
