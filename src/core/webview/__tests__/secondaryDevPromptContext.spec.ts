import { describe, expect, it } from "vitest"

import {
	augmentInstructionsWithSecondaryDevContext,
	buildSecondaryDevPromptContext,
} from "../secondaryDevPromptContext"

describe("secondaryDevPromptContext", () => {
	it("returns empty context for non-huayun modes", () => {
		expect(
			buildSecondaryDevPromptContext({
				mode: "code",
				secondaryDevBaseUrl: "https://cad.example.com",
			}),
		).toBe("")
	})

	it("injects secondary dev settings for huayun mode without exposing the raw client secret", () => {
		const result = augmentInstructionsWithSecondaryDevContext({
			mode: "huayun-secondary-dev",
			customInstructions: "Base instructions",
			secondaryDevBaseUrl: "https://cad.example.com",
			secondaryDevOAuthEnabled: true,
			secondaryDevClientId: "client-id",
			secondaryDevClientSecret: "super-secret-value",
			secondaryDevAuthorizePath: "oauth/authorize",
			secondaryDevAuthorizationUrl: "https://cad.example.com/oauth/authorize",
			secondaryDevFrontendRedirectUrl: "http://localhost:8080/token",
			secondaryDevTokenPath: "oauth/token",
			secondaryDevTokenUrl: "https://cad.example.com/oauth/token",
			secondaryDevScope: "document:read",
		})

		expect(result).toContain("Base instructions")
		expect(result).toContain("Settings UI under")
		expect(result).toContain("always-on defaults")
		expect(result).toContain("users may describe business goals in plain language")
		expect(result).toContain("non-developer engineering designer")
		expect(result).toContain("Ask follow-up questions only for missing business decisions")
		expect(result).toContain("Prefer Vue for frontend implementation by default")
		expect(result).toContain("Configuration readiness: complete")
		expect(result).toContain("Missing required config fields: none")
		expect(result).toContain("If configuration readiness is complete, do not ask the user again")
		expect(result).toContain("Authorization URL and Token URL as derivable from Base URL + Path")
		expect(result).toContain("`applicationId` and `redirectUrl`")
		expect(result).toContain("Build the HUAYUN authorization entry with `applicationId` from Client ID")
		expect(result).toContain("`client_id` or `redirect_uri`")
		expect(result).toContain("must implement and register the exact callback path")
		expect(result).toContain("OAuth browser entry and callback handling should happen in the frontend")
		expect(result).toContain("even when the user does not restate that frontend responsibility")
		expect(result).toContain("returns `code` and `scope`")
		expect(result).toContain("call the backend token-exchange endpoint")
		expect(result).toContain("mandatory default architecture rules in this mode")
		expect(result).toContain("Do not assume the platform returns `state`")
		expect(result).toContain("POST `application/x-www-form-urlencoded`")
		expect(result).toContain("`grant_type`, `code`, `client_id`, `client_secret`, and `client_scope`")
		expect(result).toContain("Map callback `scope` to token form field `client_scope`")
		expect(result).toContain("Only the backend should exchange tokens with `client_secret`")
		expect(result).toContain("do not ask the user to paste it in chat")
		expect(result).toContain("intentionally not exposed in the prompt context for security")
		expect(result).toContain("already available through configured secret storage or backend binding")
		expect(result).toContain("write HUAYUN secondary-development configuration into a backend `.env` file")
		expect(result).toContain("read those values from environment variables")
		expect(result).toContain("do not fall back to writing the secret literal into project files")
		expect(result).toContain(
			"Final OAuth tokens such as `access_token`, `refresh_token`, or `id_token` must remain backend-only",
		)
		expect(result).toContain("browser storage, URLs, or user-visible pages")
		expect(result).toContain("session, cookie, or proxy endpoints")
		expect(result).toContain("HUAYUN_CLIENT_SECRET")
		expect(result).toContain("Do not invent CrownCAD upstream API paths")
		expect(result).toContain("inspect HUAYUN rule materials first")
		expect(result).toContain("inspect the current workspace first")
		expect(result).toContain("Do not prefer user-home rule directories")
		expect(result).toContain("Use user-home or global rule directories only as a fallback")
		expect(result).toContain(
			"Treat internal rule paths such as `.roo/...` and `.roomodes` as implementation details",
		)
		expect(result).toContain("say `current project rule materials` or `current project configuration`")
		expect(result).toContain("treat the task as rule-material lookup by default")
		expect(result).toContain("answer the rule-material conclusion first")
		expect(result).toContain("provide the lookup basis instead of inferring from missing implementation code")
		expect(result).toContain("never determine API semantics from URL alone")
		expect(result).toContain("determine capability semantics by `Method + Path` together")
		expect(result).toContain("Do not collapse `GET`, `POST`, `PUT`, and `DELETE` on the same path")
		expect(result).toContain("Distinguish `present in rules/materials` from `already implemented in business code`")
		expect(result).toContain("Do not answer `not found` or `missing API material` merely because")
		expect(result).toContain("If a required API is missing")
		expect(result).toContain("built-in default in this mode")
		expect(result).toContain("Standard system Folder APIs are known provided APIs")
		expect(result).toContain("`PATCH /api/folder/{folderId}/name`")
		expect(result).toContain("Do not claim Folder query, create, share, rename, or delete APIs are missing")
		expect(result).toContain("standalone system `Folder` resources and document-type `FolderDocument`")
		expect(result).toContain("Use system `Folder` APIs for generic folder CRUD")
		expect(result).toContain("- Base URL: https://cad.example.com")
		expect(result).toContain("- Client ID: client-id")
		expect(result).toContain("- Client Secret Configured: true")
		expect(result).toContain("- Authorization URL: https://cad.example.com/oauth/authorize")
		expect(result).toContain("- Frontend OAuth Redirect URL: http://localhost:8080/token")
		expect(result).toContain("- Token URL: https://cad.example.com/oauth/token")
		expect(result).not.toContain("super-secret-value")
	})

	it("derives urls and limits follow-up questions to exact missing config fields", () => {
		const result = buildSecondaryDevPromptContext({
			mode: "huayun-secondary-dev",
			secondaryDevBaseUrl: "https://cad.example.com/",
			secondaryDevOAuthEnabled: true,
			secondaryDevAuthorizationUrl: "https://cad.example.com/oauth/authorize",
			secondaryDevTokenUrl: "https://cad.example.com/oauth/token",
		})

		expect(result).toContain("Configuration readiness: incomplete")
		expect(result).toContain(
			"Missing required config fields: Client ID, Client Secret, Frontend OAuth Redirect URL",
		)
		expect(result).toContain(
			"If configuration readiness is incomplete, ask only for the exact missing required config fields",
		)
		expect(result).toContain("- Authorize Path: oauth/authorize")
		expect(result).toContain("- Token Path: oauth/token")
		expect(result).toContain("- Authorization URL: https://cad.example.com/oauth/authorize")
		expect(result).toContain("- Token URL: https://cad.example.com/oauth/token")
	})
})
