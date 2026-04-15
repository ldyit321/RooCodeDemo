import { HTMLAttributes, useEffect, useMemo } from "react"

import { Input } from "@/components/ui"
import { useAppTranslation } from "@/i18n/TranslationContext"
import { ExtensionStateContextType } from "@/context/ExtensionStateContext"

import { Section } from "./Section"
import { SectionHeader } from "./SectionHeader"
import { SearchableSetting } from "./SearchableSetting"
import { SetCachedStateField } from "./types"

interface SecondaryDevSettingsProps extends HTMLAttributes<HTMLDivElement> {
	secondaryDevBaseUrl?: string
	secondaryDevClientId?: string
	secondaryDevClientSecret?: string
	secondaryDevAuthorizePath?: string
	secondaryDevAuthorizationUrl?: string
	secondaryDevFrontendRedirectUrl?: string
	secondaryDevTokenPath?: string
	secondaryDevTokenUrl?: string
	secondaryDevScope?: string
	setCachedStateField: SetCachedStateField<keyof ExtensionStateContextType>
	setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}

const isValidUrl = (value: string) => {
	try {
		new URL(value)
		return true
	} catch {
		return false
	}
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

const trimLeadingSlash = (value: string) => value.replace(/^\/+/, "")

const normalizeAuthorizePath = (value: string) => trimLeadingSlash(value.trim())

const buildAuthorizationUrl = (baseUrl: string, authorizePath: string) => {
	const normalizedBaseUrl = trimTrailingSlash(baseUrl.trim())
	const normalizedAuthorizePath = normalizeAuthorizePath(authorizePath)

	if (!normalizedBaseUrl || !normalizedAuthorizePath) {
		return ""
	}

	return `${normalizedBaseUrl}/${normalizedAuthorizePath}`
}

const deriveAuthorizePath = (baseUrl: string, authorizationUrl: string) => {
	const normalizedBaseUrl = trimTrailingSlash(baseUrl.trim())
	const normalizedAuthorizationUrl = authorizationUrl.trim()

	if (!normalizedBaseUrl || !normalizedAuthorizationUrl) {
		return ""
	}

	if (!normalizedAuthorizationUrl.startsWith(normalizedBaseUrl)) {
		return ""
	}

	return normalizeAuthorizePath(normalizedAuthorizationUrl.slice(normalizedBaseUrl.length))
}

const deriveRelativePath = (baseUrl: string, fullUrl: string) => {
	const normalizedBaseUrl = trimTrailingSlash(baseUrl.trim())
	const normalizedFullUrl = fullUrl.trim()

	if (!normalizedBaseUrl || !normalizedFullUrl) {
		return ""
	}

	if (!normalizedFullUrl.startsWith(normalizedBaseUrl)) {
		return ""
	}

	return normalizeAuthorizePath(normalizedFullUrl.slice(normalizedBaseUrl.length))
}

export const SecondaryDevSettings = ({
	secondaryDevBaseUrl,
	secondaryDevClientId,
	secondaryDevClientSecret,
	secondaryDevAuthorizePath,
	secondaryDevAuthorizationUrl,
	secondaryDevFrontendRedirectUrl,
	secondaryDevTokenPath,
	secondaryDevTokenUrl,
	secondaryDevScope,
	setCachedStateField,
	setErrorMessage,
	...props
}: SecondaryDevSettingsProps) => {
	const { t } = useAppTranslation()
	const resolvedAuthorizePath =
		secondaryDevAuthorizePath?.trim() ||
		deriveAuthorizePath(secondaryDevBaseUrl || "", secondaryDevAuthorizationUrl || "")
	const resolvedAuthorizationUrl = buildAuthorizationUrl(secondaryDevBaseUrl || "", resolvedAuthorizePath)
	const resolvedTokenPath =
		secondaryDevTokenPath?.trim() || deriveRelativePath(secondaryDevBaseUrl || "", secondaryDevTokenUrl || "")
	const resolvedTokenUrl = buildAuthorizationUrl(secondaryDevBaseUrl || "", resolvedTokenPath)

	const validationError = useMemo(() => {
		const baseUrl = secondaryDevBaseUrl?.trim() || ""
		const authorizePath = resolvedAuthorizePath
		const authUrl = resolvedAuthorizationUrl
		const tokenPath = resolvedTokenPath
		const tokenUrl = resolvedTokenUrl
		const clientId = secondaryDevClientId?.trim() || ""
		const clientSecret = secondaryDevClientSecret?.trim() || ""
		const frontendRedirectUrl = secondaryDevFrontendRedirectUrl?.trim() || ""

		if (!baseUrl) {
			return t("settings:secondaryDev.validation.baseUrlRequired")
		}

		if (!isValidUrl(baseUrl)) {
			return t("settings:secondaryDev.validation.baseUrlInvalid")
		}

		if (!clientId) {
			return t("settings:secondaryDev.validation.clientIdRequired")
		}

		if (!clientSecret) {
			return t("settings:secondaryDev.validation.clientSecretRequired")
		}

		if (!frontendRedirectUrl) {
			return t("settings:secondaryDev.validation.frontendRedirectUrlRequired")
		}

		if (!isValidUrl(frontendRedirectUrl)) {
			return t("settings:secondaryDev.validation.frontendRedirectUrlInvalid")
		}

		if (!authorizePath) {
			return t("settings:secondaryDev.validation.authorizePathRequired")
		}

		if (!authUrl || !isValidUrl(authUrl)) {
			return t("settings:secondaryDev.validation.authorizationUrlInvalid")
		}

		if (!tokenPath) {
			return t("settings:secondaryDev.validation.tokenPathRequired")
		}

		if (!tokenUrl || !isValidUrl(tokenUrl)) {
			return t("settings:secondaryDev.validation.tokenUrlInvalid")
		}

		return undefined
	}, [
		resolvedAuthorizationUrl,
		resolvedAuthorizePath,
		resolvedTokenPath,
		resolvedTokenUrl,
		secondaryDevBaseUrl,
		secondaryDevClientId,
		secondaryDevClientSecret,
		secondaryDevFrontendRedirectUrl,
		t,
	])

	useEffect(() => {
		setErrorMessage(validationError)

		return () => {
			setErrorMessage(undefined)
		}
	}, [setErrorMessage, validationError])

	return (
		<div {...props}>
			<SectionHeader>{t("settings:sections.secondaryDev")}</SectionHeader>

			<Section>
				<div className="space-y-6">
					<SearchableSetting
						settingId="secondary-dev-base-url"
						section="secondaryDev"
						label={t("settings:secondaryDev.baseUrl.label")}>
						<div className="flex flex-col gap-2">
							<label className="font-medium" htmlFor="secondary-dev-base-url">
								{t("settings:secondaryDev.baseUrl.label")}
							</label>
							<Input
								id="secondary-dev-base-url"
								value={secondaryDevBaseUrl || ""}
								onChange={(event) => {
									const nextBaseUrl = event.target.value
									setCachedStateField("secondaryDevBaseUrl", nextBaseUrl)
									setCachedStateField(
										"secondaryDevAuthorizationUrl",
										buildAuthorizationUrl(nextBaseUrl, resolvedAuthorizePath),
									)
								}}
								placeholder={t("settings:secondaryDev.baseUrl.placeholder")}
								data-testid="secondary-dev-base-url-input"
							/>
							<div className="text-vscode-descriptionForeground text-sm">
								{t("settings:secondaryDev.baseUrl.description")}
							</div>
						</div>
					</SearchableSetting>

					<div className="space-y-6 border border-vscode-input-border rounded-lg p-4">
						<SearchableSetting
							settingId="secondary-dev-client-id"
							section="secondaryDev"
							label={t("settings:secondaryDev.clientId.label")}>
							<div className="flex flex-col gap-2">
								<label className="font-medium" htmlFor="secondary-dev-client-id">
									{t("settings:secondaryDev.clientId.label")}
								</label>
								<Input
									id="secondary-dev-client-id"
									value={secondaryDevClientId || ""}
									onChange={(event) =>
										setCachedStateField("secondaryDevClientId", event.target.value)
									}
									placeholder={t("settings:secondaryDev.clientId.placeholder")}
									data-testid="secondary-dev-client-id-input"
								/>
							</div>
						</SearchableSetting>

						<SearchableSetting
							settingId="secondary-dev-client-secret"
							section="secondaryDev"
							label={t("settings:secondaryDev.clientSecret.label")}>
							<div className="flex flex-col gap-2">
								<label className="font-medium" htmlFor="secondary-dev-client-secret">
									{t("settings:secondaryDev.clientSecret.label")}
								</label>
								<Input
									id="secondary-dev-client-secret"
									type="password"
									value={secondaryDevClientSecret || ""}
									onChange={(event) =>
										setCachedStateField("secondaryDevClientSecret", event.target.value)
									}
									placeholder={t("settings:secondaryDev.clientSecret.placeholder")}
									data-testid="secondary-dev-client-secret-input"
								/>
							</div>
						</SearchableSetting>

						<SearchableSetting
							settingId="secondary-dev-frontend-redirect-url"
							section="secondaryDev"
							label={t("settings:secondaryDev.frontendRedirectUrl.label")}>
							<div className="flex flex-col gap-2">
								<label className="font-medium" htmlFor="secondary-dev-frontend-redirect-url">
									{t("settings:secondaryDev.frontendRedirectUrl.label")}
								</label>
								<Input
									id="secondary-dev-frontend-redirect-url"
									value={secondaryDevFrontendRedirectUrl || ""}
									onChange={(event) =>
										setCachedStateField("secondaryDevFrontendRedirectUrl", event.target.value)
									}
									placeholder={t("settings:secondaryDev.frontendRedirectUrl.placeholder")}
									data-testid="secondary-dev-frontend-redirect-url-input"
								/>
								<div className="text-vscode-descriptionForeground text-sm">
									{t("settings:secondaryDev.frontendRedirectUrl.description")}
								</div>
							</div>
						</SearchableSetting>

						<SearchableSetting
							settingId="secondary-dev-authorize-path"
							section="secondaryDev"
							label={t("settings:secondaryDev.authorizePath.label")}>
							<div className="flex flex-col gap-2">
								<label className="font-medium" htmlFor="secondary-dev-authorize-path">
									{t("settings:secondaryDev.authorizePath.label")}
								</label>
								<Input
									id="secondary-dev-authorize-path"
									value={resolvedAuthorizePath}
									onChange={(event) => {
										const nextAuthorizePath = event.target.value
										setCachedStateField("secondaryDevAuthorizePath", nextAuthorizePath)
										setCachedStateField(
											"secondaryDevAuthorizationUrl",
											buildAuthorizationUrl(secondaryDevBaseUrl || "", nextAuthorizePath),
										)
									}}
									placeholder={t("settings:secondaryDev.authorizePath.placeholder")}
									data-testid="secondary-dev-authorize-path-input"
								/>
								<div className="text-vscode-descriptionForeground text-sm">
									{t("settings:secondaryDev.authorizePath.description")}
								</div>
								<div className="flex flex-col gap-2">
									<label className="font-medium" htmlFor="secondary-dev-authorization-url-preview">
										{t("settings:secondaryDev.authorizationUrl.label")}
									</label>
									<Input
										id="secondary-dev-authorization-url-preview"
										value={resolvedAuthorizationUrl}
										readOnly
										placeholder={t("settings:secondaryDev.authorizationUrl.placeholder")}
										data-testid="secondary-dev-authorization-url-preview"
									/>
								</div>
							</div>
						</SearchableSetting>

						<SearchableSetting
							settingId="secondary-dev-token-path"
							section="secondaryDev"
							label={t("settings:secondaryDev.tokenPath.label")}>
							<div className="flex flex-col gap-2">
								<label className="font-medium" htmlFor="secondary-dev-token-path">
									{t("settings:secondaryDev.tokenPath.label")}
								</label>
								<Input
									id="secondary-dev-token-path"
									value={resolvedTokenPath}
									onChange={(event) => {
										const nextTokenPath = event.target.value
										setCachedStateField("secondaryDevTokenPath", nextTokenPath)
										setCachedStateField(
											"secondaryDevTokenUrl",
											buildAuthorizationUrl(secondaryDevBaseUrl || "", nextTokenPath),
										)
									}}
									placeholder={t("settings:secondaryDev.tokenPath.placeholder")}
									data-testid="secondary-dev-token-path-input"
								/>
								<div className="text-vscode-descriptionForeground text-sm">
									{t("settings:secondaryDev.tokenPath.description")}
								</div>
								<div className="flex flex-col gap-2">
									<label className="font-medium" htmlFor="secondary-dev-token-url-preview">
										{t("settings:secondaryDev.tokenUrl.label")}
									</label>
									<Input
										id="secondary-dev-token-url-preview"
										value={resolvedTokenUrl}
										readOnly
										placeholder={t("settings:secondaryDev.tokenUrl.placeholder")}
										data-testid="secondary-dev-token-url-preview"
									/>
								</div>
							</div>
						</SearchableSetting>

						<SearchableSetting
							settingId="secondary-dev-scope"
							section="secondaryDev"
							label={t("settings:secondaryDev.scope.label")}>
							<div className="flex flex-col gap-2">
								<label className="font-medium" htmlFor="secondary-dev-scope">
									{t("settings:secondaryDev.scope.label")}
								</label>
								<Input
									id="secondary-dev-scope"
									value={secondaryDevScope || ""}
									onChange={(event) => setCachedStateField("secondaryDevScope", event.target.value)}
									placeholder={t("settings:secondaryDev.scope.placeholder")}
									data-testid="secondary-dev-scope-input"
								/>
							</div>
						</SearchableSetting>
					</div>

					{validationError && (
						<div
							className="text-vscode-errorForeground text-sm border border-vscode-errorForeground rounded-md px-3 py-2"
							data-testid="secondary-dev-validation-error">
							{validationError}
						</div>
					)}
				</div>
			</Section>
		</div>
	)
}
