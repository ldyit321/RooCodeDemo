# CrownCAD Authentication And Security

## Default Rule

- In `huayun-secondary-dev` mode, OAuth2 is the default and preferred authentication mechanism.
- The mode must treat authentication as the first implementation phase before business features unless the user explicitly says auth is already finished for the current task.
- Even though `BasicAuth` and `BearerAuth` exist in the latest OpenAPI, do not silently downgrade from OAuth2 without an explicit platform requirement.

## Known Security Schemes

- `OAuth2`
- `BasicAuth`
- `BearerAuth`

## Preferred OAuth2 Flow

- Flow: `authorizationCode`
- Authorization URL: `/oauth/crownapi/authorize`
- Token URL: `/oauth/token`

## Default Authorization Entry Rule

- In HUAYUN secondary development, default the login entry page to this URL shape:
    - `{baseUrl}/{authorizePath}?applicationId=<applicationId>&redirectUrl=<redirectUrl>`
- The current user-provided example is:
    - `{baseUrl}/{authorizePath}?applicationId=69d75be17ea9b743c7b535d6&redirectUrl=http://localhost:8080/token`
- Treat `baseUrl` as the configured platform base address.
- Treat `authorizePath` as the configured authorization entry path.
- Treat `applicationId` as a required authorization entry parameter.
- Treat `redirectUrl` as the required callback address parameter for the platform login redirect.
- Resolve `redirectUrl` from the configured Frontend OAuth Redirect URL, not from the backend token endpoint.
- Unless the user explicitly overrides it, do not rename these query parameters and do not replace `applicationId` with generic names such as `client_id`.
- Unless the user explicitly overrides it, do not replace `redirectUrl` with generic names such as `redirect_uri`.
- When writing OAuth2 code, examples, pseudocode, or architecture notes for HUAYUN secondary development, use `applicationId` and `redirectUrl` exactly as the platform parameter names.
- If an implementation draft contains `client_id` or `redirect_uri` for the HUAYUN authorization entry page, treat that as incorrect and fix it before finalizing.

## Frontend Redirect And Backend Token Exchange Rule

- Frontend responsibility for authorization entry and callback handling, plus backend responsibility for token exchange, final token storage, and secret isolation, are built-in defaults in HUAYUN secondary development and must not depend on the user repeating them in later prompts.
- By default, OAuth browser entry and redirect callback handling belong in the frontend service.
- The platform should redirect the browser to the configured Frontend OAuth Redirect URL with `code` and `scope` query parameters.
- The configured Frontend OAuth Redirect URL is a frontend address and its path must be implemented explicitly in the generated frontend router/page structure; do not omit the frontend callback path and keep only the origin.
- Frontend code should parse `code` and `scope`, then call a backend token-exchange route.
- Backend code owns the token exchange request to `{baseUrl}/{tokenPath}` because that is where `client_secret` is required.
- Frontend code must not store, print, hardcode, or send `client_secret` to the browser.

## Default Token Endpoint Rule

- In HUAYUN secondary development, default the token endpoint to this URL shape:
    - `{baseUrl}/{tokenPath}`
- Treat `tokenPath` as the configured token exchange path.
- Unless the user explicitly overrides it, construct the final token URL from `baseUrl` and `tokenPath` instead of treating it as an unrelated standalone URL.
- Exchange authorization `code` for token by sending:
    - Method: `POST`
    - Content-Type: `application/x-www-form-urlencoded`
    - URL: `{baseUrl}/{tokenPath}`
- The token exchange form body must use these field names:
    - `grant_type`
    - `code`
    - `client_id`
    - `client_secret`
    - `client_scope`
- Default `grant_type` to the authorization-code grant value required by the platform flow.
- Use the callback `code` value as the `code` form field.
- Use the configured Client ID as `client_id`.
- Use the configured Client Secret as `client_secret`.
- Use the callback `scope` value as `client_scope` when present; otherwise fall back to the configured scope.
- Do not send token exchange data as JSON unless the user explicitly provides a different token API contract.
- Do not use authorization-entry parameter names such as `applicationId` or `redirectUrl` as token exchange form field names.
- Do not use generic callback or authorization fields such as `redirect_uri`, `scope`, or `state` as token exchange form field names unless explicitly required by a newer API contract.

## Client Secret Handling Rule

- The Secondary Dev settings page is the authoritative source for the OAuth2 Client Secret when it has already been configured there.
- If runtime context says `Client Secret Configured: true`, do not ask the user to paste or re-enter the Client Secret in chat.
- The raw Client Secret value may be intentionally hidden from prompts and generated frontend code for security; treat configured secret state as an already-available backend secret binding, not as a missing value.
- OAuth token exchange code must populate the `client_secret` form field from the configured secret source, not from hardcoded literals or user chat messages.
- For generated standalone backend projects, write HUAYUN secondary-development configuration into a backend `.env` file or `.env` template by default.
- For generated standalone Python backend projects, default to the standard runnable HUAYUN layout with `backend/app/main.py` as the application entrypoint, `backend/pyproject.toml` as the manifest, and `backend/.env` or `backend/.env.example` as the config template.
- Backend runtime and auth code should read Base URL, Client ID, Client Secret, authorization path, token path, redirect URL, and scope from `.env`-backed environment variables or a centralized settings module that loads `.env`.
- Never print, echo, log, persist in generated source, or include the raw Client Secret in documentation, examples, commit messages, or responses.
- For generated backend code, prefer reading the secret from a config module, backend secret provider, or environment variable binding such as `HUAYUN_CLIENT_SECRET`.
- If a standalone generated project cannot access the extension's Secondary Dev settings directly, report that a secret/config binding is required and create only a backend-only placeholder or configuration interface; do not ask the user for the raw secret value.
- If configured secret reading fails during generation, do not fall back to writing the secret literal into project source, examples, env samples, or frontend code.
- If `Client Secret Configured: false` or the setting is missing, report the missing setting and ask the user to complete the Secondary Dev settings page instead of requesting the secret in the conversation.

## Backend-Only Token Rule

- Backend-only token handling is a built-in default rule in HUAYUN secondary development and must not depend on the user restating it.
- The final OAuth token result must remain backend-only in HUAYUN secondary development by default.
- Do not expose raw `access_token`, `refresh_token`, or similar token payloads to frontend code, browser storage, URL parameters, HTML output, or user-visible debug pages.
- Because HUAYUN plugins are commonly embedded as iframes inside other systems, do not rely on a cookie-only session design.
- Generated frontend/backend session handling must use a Cookie + Header dual-channel strategy.
- The backend must issue and validate a backend-controlled session through both an HttpOnly cookie and a header fallback channel such as `X-Huayun-Session`.
- The header fallback must contain only a backend-issued session identifier or signed session token, never the raw OAuth token payload.
- Frontend request code should communicate with backend session or proxy endpoints after login and should send both `credentials: include` and the configured session header when a backend-issued session value is available.
- Backend auth middleware and proxy layers should accept the cookie channel first and fall back to the configured session header when cookie delivery fails because of iframe embedding, third-party cookie restrictions, cross-site, or browser privacy behavior.
- Backend CORS and session settings must explicitly allow the credentialed iframe case and the configured custom session header.
- If frontend login success needs to be indicated, return only minimal session status or user-facing state, not the raw token payload.

## Default Redirect Callback Contract

- In HUAYUN secondary development, assume the platform redirects back to the configured Frontend OAuth Redirect URL after authorization.
- Assume the redirect callback includes at least these query parameters:
    - `code`
    - `scope`
- Treat `code` as the authorization code used for token exchange.
- Treat `scope` as the granted scope string returned by the platform and preserve it for logging, verification, or downstream session metadata when useful.
- Unless the user says otherwise, design frontend callback handlers around this default callback contract, and let the frontend call backend token exchange after parsing `code` and `scope`.
- Unless the user explicitly confirms otherwise, do not assume the platform callback includes `state`.
- If generated code or design notes depend on `state` being returned by the platform callback, treat that as incorrect for the default HUAYUN contract and revise it to use `code` and `scope`.
- If local CSRF or nonce protection is needed, it may be implemented internally, but must not change the default assumption that the platform callback itself returns `code` and `scope`.

## Known OAuth2 Scopes

- `project:create`
- `project:delete`
- `document:create`
- `document:delete`
- `document:write`
- `document:read`
- `user:read`

## Auth Implementation Rules

- Prefer OAuth2 over `BasicAuth` and `BearerAuth` unless the user explicitly requires another scheme.
- Treat missing-API stop/report behavior as a built-in default across auth-related work as well; if an auth endpoint or field is not provided, report the missing contract instead of fabricating it.
- Request the minimum scopes needed for the feature being implemented.
- When generating code, first determine:
    - login initiation path
    - how `{baseUrl}`, `{authorizePath}`, `applicationId`, and `redirectUrl` are resolved
    - how `{baseUrl}` and `{tokenPath}` are resolved for token exchange
    - frontend redirect callback path
    - how `code` and `scope` are read from the redirect callback
    - backend token-exchange route called by the frontend
    - access token storage strategy
    - refresh token behavior if applicable
    - how the token is injected into API requests
    - which scopes are required by the current feature set
- When implementing login initiation, prefer building the authorization URL from configured values instead of hardcoding a one-off string in page code.
- If the software already stores `baseUrl`, `applicationId`, `authorizePath`, or Frontend OAuth Redirect URL, reuse those configuration sources instead of duplicating them in feature modules.
- When implementing callback handling, parse both `code` and `scope` explicitly instead of assuming only `code` will be returned.
- If scope verification is needed, compare the returned `scope` value with the scopes requested by the current feature flow.
- If the repository already has auth utilities, extend them instead of creating a parallel auth stack.
- If the repository has no auth code yet, create the minimum required bootstrap and keep the implementation easy to replace.
- For iframe-delivered plugin scenarios, make the session header name centralized in backend/frontend config instead of scattering hardcoded header literals across modules.
- For frontend implementation choice, use Vue as the required default in HUAYUN secondary development.
- Do not switch to plain JavaScript plus HTML/CSS as the primary frontend path unless the rule set is explicitly revised for that project.

## Alternative Schemes

- `BasicAuth` is available in the latest spec, but should be treated as an explicit alternative integration mode.
- `BearerAuth` is also available, but should not replace the OAuth2-first workflow in HUAYUN mode by default.
- If a task explicitly asks for non-OAuth auth, state that the implementation is diverging from the default HUAYUN delivery contract.
