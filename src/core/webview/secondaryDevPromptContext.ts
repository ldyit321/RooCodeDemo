import { HUAYUN_SECONDARY_DEV_MODE_SLUG } from "./secondaryDevWorkflow"

const trimValue = (value?: string) => value?.trim() ?? ""
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, "")
const normalizeRelativePath = (value: string) => trimLeadingSlash(value.trim())

const buildConfiguredUrl = (baseUrl: string, relativePath: string) => {
	const normalizedBaseUrl = trimTrailingSlash(baseUrl)
	const normalizedRelativePath = normalizeRelativePath(relativePath)

	if (!normalizedBaseUrl || !normalizedRelativePath) {
		return ""
	}

	return `${normalizedBaseUrl}/${normalizedRelativePath}`
}

const deriveRelativePath = (baseUrl: string, fullUrl: string) => {
	const normalizedBaseUrl = trimTrailingSlash(baseUrl)
	const normalizedFullUrl = fullUrl.trim()

	if (!normalizedBaseUrl || !normalizedFullUrl || !normalizedFullUrl.startsWith(normalizedBaseUrl)) {
		return ""
	}

	return normalizeRelativePath(normalizedFullUrl.slice(normalizedBaseUrl.length))
}

export interface SecondaryDevPromptState {
	mode?: string
	customInstructions?: string
	secondaryDevBaseUrl?: string
	secondaryDevOAuthEnabled?: boolean
	secondaryDevClientId?: string
	secondaryDevClientSecret?: string
	secondaryDevAuthorizePath?: string
	secondaryDevAuthorizationUrl?: string
	secondaryDevFrontendRedirectUrl?: string
	secondaryDevTokenPath?: string
	secondaryDevTokenUrl?: string
	secondaryDevScope?: string
}

export const buildSecondaryDevPromptContext = (state: SecondaryDevPromptState): string => {
	if (state.mode !== HUAYUN_SECONDARY_DEV_MODE_SLUG) {
		return ""
	}

	const baseUrl = trimValue(state.secondaryDevBaseUrl)
	const clientId = trimValue(state.secondaryDevClientId)
	const frontendRedirectUrl = trimValue(state.secondaryDevFrontendRedirectUrl)
	const scope = trimValue(state.secondaryDevScope)
	const oauthEnabled = state.secondaryDevOAuthEnabled !== false
	const clientSecretConfigured = trimValue(state.secondaryDevClientSecret).length > 0
	const authorizePath =
		trimValue(state.secondaryDevAuthorizePath) ||
		deriveRelativePath(baseUrl, trimValue(state.secondaryDevAuthorizationUrl))
	const authorizationUrl = trimValue(state.secondaryDevAuthorizationUrl) || buildConfiguredUrl(baseUrl, authorizePath)
	const tokenPath =
		trimValue(state.secondaryDevTokenPath) || deriveRelativePath(baseUrl, trimValue(state.secondaryDevTokenUrl))
	const tokenUrl = trimValue(state.secondaryDevTokenUrl) || buildConfiguredUrl(baseUrl, tokenPath)
	const requiredConfigFields: Array<{ label: string; missing: boolean }> = [
		{ label: "Base URL", missing: !baseUrl },
		{ label: "Client ID", missing: !clientId },
		{ label: "Client Secret", missing: !clientSecretConfigured },
		{ label: "Frontend OAuth Redirect URL", missing: !frontendRedirectUrl },
		{ label: "Authorize Path", missing: oauthEnabled && !authorizePath },
		{ label: "Token Path", missing: oauthEnabled && !tokenPath },
	]
	const missingRequiredFields = requiredConfigFields.filter((field) => field.missing).map((field) => field.label)
	const configReadiness = missingRequiredFields.length === 0 ? "complete" : "incomplete"
	const hasConfiguredFields =
		Boolean(baseUrl) ||
		Boolean(clientId) ||
		Boolean(authorizePath) ||
		Boolean(authorizationUrl) ||
		Boolean(frontendRedirectUrl) ||
		Boolean(tokenPath) ||
		Boolean(tokenUrl) ||
		Boolean(scope) ||
		clientSecretConfigured

	if (!hasConfiguredFields) {
		return ""
	}

	return [
		"HUAYUN Secondary Development Runtime Configuration",
		"- The project's secondary development configuration is stored in the Settings UI under `二开配置` / `Secondary Dev`, not in arbitrary workspace files.",
		"- Treat these settings as the authoritative runtime configuration for HUAYUN secondary development tasks.",
		"- Treat HUAYUN mode, configured Secondary Dev settings, frontend/backend OAuth responsibility split, backend-only secret/token handling, and missing-API stop behavior as always-on defaults. Do not require the user to restate any of them in later prompts.",
		"- Do not ask the user where these settings are stored unless a required value is actually missing.",
		"- Follow this HUAYUN decision route in order: mode behavior + configured Secondary Dev settings -> current workspace HUAYUN rules -> relevant module rule file -> thin skill / AGENTS supplement -> business implementation code.",
		"- Treat prompt-time rule interpretation and code-time implementation lookup as separate steps; do not reverse that order.",
		"- Treat Authorization URL and Token URL as derivable from Base URL + Path when those URLs are not separately configured.",
		"- Default to HUAYUN Secondary Dev behavior for simple CAD engineering requests; users may describe business goals in plain language without naming OAuth2, frontend, backend, Python, or API details.",
		"- When the user is a non-developer engineering designer, translate concise CAD/business language into the required technical workflow internally and avoid asking them to repeat platform constraints already defined by this mode.",
		"- Ask follow-up questions only for missing business decisions or destructive/ambiguous operations; do not ask for technical defaults that are already defined by HUAYUN Secondary Dev settings, rules, or scaffold conventions.",
		"- Prefer short, actionable Chinese explanations for user-facing responses unless the user asks for deeper technical detail.",
		"- Prefer Vue for frontend implementation by default. Use plain JavaScript + HTML/CSS only when the page is extremely small, mostly static, or the user explicitly asks for native frontend.",
		`- Configuration readiness: ${configReadiness}`,
		`- Missing required config fields: ${missingRequiredFields.length > 0 ? missingRequiredFields.join(", ") : "none"}`,
		"- If configuration readiness is complete, do not ask the user again for Base URL, OAuth URLs/paths, Frontend OAuth Redirect URL, Client ID, Client Secret, or Scope.",
		"- If configuration readiness is incomplete, ask only for the exact missing required config fields listed above and do not ask where the settings are stored.",
		"- For the HUAYUN authorization entry URL, keep the query parameter names as `applicationId` and `redirectUrl` unless the user explicitly overrides them.",
		"- Build the HUAYUN authorization entry with `applicationId` from Client ID and `redirectUrl` from Frontend OAuth Redirect URL.",
		"- Do not silently rewrite the HUAYUN authorization entry query parameters to generic OAuth names such as `client_id` or `redirect_uri`.",
		"- The configured Frontend OAuth Redirect URL is a frontend URL. Generated frontend code must implement and register the exact callback path implied by that URL, and must not omit the frontend route/path segment.",
		"- OAuth browser entry and callback handling should happen in the frontend by default, even when the user does not restate that frontend responsibility in the task prompt.",
		"- For the default HUAYUN redirect callback, assume the platform returns `code` and `scope` through the configured Frontend OAuth Redirect URL.",
		"- Do not assume the platform returns `state` unless the user explicitly confirms that their platform callback includes it.",
		"- After the frontend receives `code` and `scope`, it should call the backend token-exchange endpoint and pass those values to the backend.",
		"- Backend token exchange, backend token storage, and backend secret isolation are mandatory default architecture rules in this mode; do not wait for the user to ask for that split explicitly.",
		"- For code-to-token exchange, POST `application/x-www-form-urlencoded` to `{baseUrl}/{tokenPath}`.",
		"- Token exchange form fields must be `grant_type`, `code`, `client_id`, `client_secret`, and `client_scope`.",
		"- Map callback `scope` to token form field `client_scope`; do not use `scope`, `state`, `applicationId`, `redirectUrl`, or `redirect_uri` as default token exchange form field names.",
		"- Only the backend should exchange tokens with `client_secret`; frontend code must not store, print, or send `client_secret` to the browser.",
		"- If `Client Secret Configured` is true, treat the OAuth2 Client Secret as already configured and do not ask the user to paste it in chat.",
		"- The raw Client Secret value is intentionally not exposed in the prompt context for security. `Client Secret Configured: true` means the backend must treat the secret as already available through configured secret storage or backend binding, not as a missing value to request from the user again.",
		"- For generated standalone backend projects, write HUAYUN secondary-development configuration into a backend `.env` file or `.env` template by default, and make backend runtime/config loading read those values from environment variables instead of hardcoding them in source files.",
		"- Backend OAuth and CrownCAD client code should read Base URL, Client ID, Client Secret, authorization path, token path, redirect URL, and scope from `.env`-backed environment/config loading by default.",
		"- Never print, hardcode, log, or expose the raw Client Secret. If configured secret reading fails in generated code, create a backend-only placeholder such as `HUAYUN_CLIENT_SECRET`; do not fall back to writing the secret literal into project files.",
		"- If a standalone generated project cannot directly access extension settings, create or reuse a named backend-only config placeholder such as `HUAYUN_CLIENT_SECRET` and report that secret binding is required instead of requesting the raw Client Secret from the user.",
		"- Final OAuth tokens such as `access_token`, `refresh_token`, or `id_token` must remain backend-only. Do not expose raw token values to frontend code, browser storage, URLs, or user-visible pages.",
		"- Frontend code should communicate with backend session, cookie, or proxy endpoints after login instead of directly storing or using the raw OAuth token payload.",
		"- Do not invent CrownCAD upstream API paths, request fields, response fields, enum values, or workflow steps that are not present in the provided API material.",
		"- When multiple HTTP methods share the same upstream path, never determine API semantics from URL alone.",
		"- For same-path multi-method APIs, determine capability semantics by `Method + Path` together.",
		"- Do not collapse `GET`, `POST`, `PUT`, and `DELETE` on the same path into a single generic endpoint understanding.",
		"- When the user asks whether an API, contract, field, enum, or capability exists, inspect HUAYUN rule materials first, especially `.roo/rules-huayun-secondary-dev`, before concluding from business implementation code.",
		"- For API lookup tasks, stop at the earliest authoritative rule layer that answers the question; do not search business code just to overturn a clear rule-material conclusion.",
		"- When searching HUAYUN rules, inspect the current workspace first, especially `.roo/rules-huayun-secondary-dev` under the active project root.",
		"- Do not prefer user-home rule directories such as `C:\\Users\\admin\\.roo\\...` over the current workspace rule set when the task is about this project.",
		"- Use user-home or global rule directories only as a fallback when the current workspace does not contain the relevant HUAYUN rule material.",
		"- Treat internal rule paths such as `.roo/...` as implementation details, not user-facing concepts, unless the user explicitly asks for those paths.",
		"- In normal user-facing replies, say `current project rule materials` or `current project configuration` instead of requiring the user to know internal `.roo` locations.",
		"- When the user asks questions like `help me check whether rule materials define this interface`, treat the task as rule-material lookup by default, not as business implementation-code lookup.",
		"- For rule-material lookup tasks, answer the rule-material conclusion first, and only then optionally mention whether business code has already implemented it.",
		"- If concluding that rule materials do not define an interface or contract, provide the lookup basis instead of inferring from missing implementation code.",
		"- Distinguish `present in rules/materials` from `already implemented in business code`.",
		"- Thin skill content is navigation-only and must not override current workspace HUAYUN rules.",
		"- `AGENTS.md` is repository-level supplemental guidance and must not override HUAYUN API truth in current workspace rules.",
		"- Do not answer `not found` or `missing API material` merely because `src`, `webview-ui`, or other business implementation directories do not yet contain a concrete wrapper or usage site.",
		"- If a required API is missing, report the missing capability, closest known APIs, safely scaffoldable parts, and blocked code paths instead of generating fake upstream calls.",
		"- Missing-API detection and stop/report behavior is a built-in default in this mode. Do not wait for the user to remind you not to fabricate interfaces.",
		"- Standard system Folder APIs are known provided APIs: `GET /api/folder`, `POST /api/folder`, `POST /api/folder/{folderId}/share`, `PATCH /api/folder/{folderId}/name`, and `DELETE /api/folder/{folderId}`.",
		"- Do not claim Folder query, create, share, rename, or delete APIs are missing when the task targets standalone system folders.",
		"- Treat standalone system `Folder` resources and document-type `FolderDocument` resources as different concepts.",
		"- Use system `Folder` APIs for generic folder CRUD/list/share/rename/delete; use `FolderDocument` for project-internal folders, document folders, or document tree folders when supported by document APIs.",
		`- OAuth2 enabled: ${oauthEnabled ? "true" : "false"}`,
		`- Base URL: ${baseUrl || "(missing)"}`,
		`- Client ID: ${clientId || "(missing)"}`,
		`- Client Secret Configured: ${clientSecretConfigured ? "true" : "false"}`,
		`- Authorize Path: ${authorizePath || "(missing)"}`,
		`- Authorization URL: ${authorizationUrl || "(missing)"}`,
		`- Frontend OAuth Redirect URL: ${frontendRedirectUrl || "(missing)"}`,
		`- Token Path: ${tokenPath || "(missing)"}`,
		`- Token URL: ${tokenUrl || "(missing)"}`,
		`- Scope: ${scope || "(empty)"}`,
		"- If the user says configuration exists in different files but these settings are already present, prefer the configured Secondary Dev settings first and only ask for file-based overrides when the task explicitly requires them.",
	].join("\n")
}

export const augmentInstructionsWithSecondaryDevContext = (state: SecondaryDevPromptState): string | undefined => {
	const runtimeContext = buildSecondaryDevPromptContext(state)
	const baseInstructions = state.customInstructions?.trim() ?? ""

	if (!runtimeContext) {
		return baseInstructions || undefined
	}

	if (!baseInstructions) {
		return runtimeContext
	}

	return `${baseInstructions}\n\n${runtimeContext}`
}
