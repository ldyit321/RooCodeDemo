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
- Unless the user explicitly overrides it, do not rename these query parameters and do not replace `applicationId` with generic names such as `client_id`.

## Default Token Endpoint Rule

- In HUAYUN secondary development, default the token endpoint to this URL shape:
    - `{baseUrl}/{tokenPath}`
- Treat `tokenPath` as the configured token exchange path.
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
- OAuth token exchange code must populate the `client_secret` form field from the configured secret source, not from hardcoded literals or user chat messages.
- Never print, echo, log, persist in generated source, or include the raw Client Secret in documentation, examples, commit messages, or responses.
- For generated backend code, prefer reading the secret from a config module, backend secret provider, or environment variable binding such as `HUAYUN_CLIENT_SECRET`.
- If a standalone generated project cannot access the extension's Secondary Dev settings directly, report that a secret/config binding is required and create only a placeholder or configuration interface; do not ask the user for the raw secret value.
- If `Client Secret Configured: false` or the setting is missing, report the missing setting and ask the user to complete the Secondary Dev settings page instead of requesting the secret in the conversation.

## Default Redirect Callback Contract

- In HUAYUN secondary development, assume the platform redirects back to the configured redirect URI after authorization.
- Assume the redirect callback includes at least these query parameters:
    - `code`
    - `scope`
- Treat `code` as the authorization code used for token exchange.
- Treat `scope` as the granted scope string returned by the platform and preserve it for logging, verification, or downstream session metadata when useful.
- Unless the user says otherwise, design frontend and backend callback handlers around this default callback contract.

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
- Request the minimum scopes needed for the feature being implemented.
- When generating code, first determine:
    - login initiation path
    - how `{baseUrl}`, `{authorizePath}`, `applicationId`, and `redirectUrl` are resolved
    - callback handling path
    - how `code` and `scope` are read from the redirect callback
    - token exchange URL, request content type, and exact form field mapping
    - access token storage strategy
    - refresh token behavior if applicable
    - how the token is injected into API requests
    - which scopes are required by the current feature set
- When implementing login initiation, prefer building the authorization URL from configured values instead of hardcoding a one-off string in page code.
- If the software already stores `baseUrl`, `applicationId`, `authorizePath`, or `redirectUrl`, reuse those configuration sources instead of duplicating them in feature modules.
- When implementing callback handling, parse both `code` and `scope` explicitly instead of assuming only `code` will be returned.
- When implementing token exchange, send form data with `grant_type`, `code`, `client_id`, `client_secret`, and `client_scope`; map callback `scope` to `client_scope`.
- If scope verification is needed, compare the returned `scope` value with the scopes requested by the current feature flow.
- If the repository already has auth utilities, extend them instead of creating a parallel auth stack.
- If the repository has no auth code yet, create the minimum required bootstrap and keep the implementation easy to replace.

## Alternative Schemes

- `BasicAuth` is available in the latest spec, but should be treated as an explicit alternative integration mode.
- `BearerAuth` is also available, but should not replace the OAuth2-first workflow in HUAYUN mode by default.
- If a task explicitly asks for non-OAuth auth, state that the implementation is diverging from the default HUAYUN delivery contract.
