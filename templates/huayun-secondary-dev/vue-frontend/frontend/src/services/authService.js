export async function ensureAuthenticated(options = {}) {
	const token = window.localStorage.getItem("crowncad_access_token")
	if (token && !options.forceLogin) {
		return token
	}

	if (options.forceLogin) {
		const params = new URLSearchParams({
			response_type: "code",
			client_id: window.__CROWNCAD_CLIENT_ID__ || "replace-me",
			redirect_uri: window.__CROWNCAD_REDIRECT_URI__ || window.location.origin,
			scope: "openid profile crowncad:document",
		})

		window.location.href = `${window.__CROWNCAD_AUTH_BASE_URL__ || "/oauth/crownapi/authorize"}?${params.toString()}`
		return
	}

	throw new Error("OAuth2 login is required before loading CrownCAD features.")
}
