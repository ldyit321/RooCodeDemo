const TOKEN_STORAGE_KEY = "crowncad_access_token"

export function getAccessToken() {
	return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export async function ensureAuthenticated(options = {}) {
	const token = getAccessToken()
	if (token && !options.forceLogin) {
		return token
	}

	if (options.forceLogin) {
		window.location.href = buildAuthorizeUrl()
	}

	throw new Error("OAuth2 login is required before loading CrownCAD features.")
}

export function buildAuthorizeUrl() {
	const baseUrl = window.__CROWNCAD_AUTH_BASE_URL__ || "/oauth/crownapi/authorize"
	const params = new URLSearchParams({
		response_type: "code",
		client_id: window.__CROWNCAD_CLIENT_ID__ || "replace-me",
		redirect_uri: window.__CROWNCAD_REDIRECT_URI__ || window.location.origin,
		scope: "openid profile crowncad:document",
	})

	return `${baseUrl}?${params.toString()}`
}
