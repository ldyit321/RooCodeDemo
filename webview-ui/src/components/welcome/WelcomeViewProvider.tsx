import { useCallback, useEffect, useRef, useState } from "react"
import {
	VSCodeLink,
	VSCodeProgressRing,
	VSCodeRadio,
	VSCodeRadioGroup,
	VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react"
import { ArrowLeft, ArrowRight, BadgeInfo, Brain, TriangleAlert } from "lucide-react"

import type { ProviderSettings } from "@roo-code/types"

import { Button } from "@src/components/ui"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { BRAND_INTRO, BRAND_NAME, BRAND_SETUP_HINT, CLOUD_BRAND_NAME } from "@src/constants/branding"
import { validateApiConfiguration } from "@src/utils/validate"
import { vscode } from "@src/utils/vscode"

import { Tab, TabContent } from "../common/Tab"
import ApiOptions from "../settings/ApiOptions"

import RooHero from "./RooHero"

type ProviderOption = "roo" | "custom"
type AuthOrigin = "landing" | "providerSelection"

const WelcomeViewProvider = () => {
	const {
		apiConfiguration,
		currentApiConfigName,
		setApiConfiguration,
		uriScheme,
		cloudIsAuthenticated,
		cloudAuthSkipModel,
	} = useExtensionState()

	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
	const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null)
	const [authInProgress, setAuthInProgress] = useState(false)
	const [authOrigin, setAuthOrigin] = useState<AuthOrigin | null>(null)
	const [showManualEntry, setShowManualEntry] = useState(false)
	const [manualUrl, setManualUrl] = useState("")
	const [manualErrorMessage, setManualErrorMessage] = useState<boolean | undefined>(undefined)
	const manualUrlInputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (cloudIsAuthenticated && authInProgress) {
			if (cloudAuthSkipModel) {
				setSelectedProvider("custom")
				setAuthInProgress(false)
				setShowManualEntry(false)
				vscode.postMessage({ type: "clearCloudAuthSkipModel" })
			} else {
				const rooConfig: ProviderSettings = {
					apiProvider: "roo",
				}
				vscode.postMessage({
					type: "upsertApiConfiguration",
					text: currentApiConfigName,
					apiConfiguration: rooConfig,
				})
				setAuthInProgress(false)
				setShowManualEntry(false)
			}
		}
	}, [authInProgress, cloudAuthSkipModel, cloudIsAuthenticated, currentApiConfigName])

	useEffect(() => {
		if (showManualEntry && manualUrlInputRef.current) {
			setTimeout(() => {
				manualUrlInputRef.current?.focus()
			}, 50)
		}
	}, [showManualEntry])

	const setApiConfigurationFieldForApiOptions = useCallback(
		<K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => {
			setApiConfiguration({ [field]: value })
		},
		[setApiConfiguration],
	)

	const handleGetStarted = useCallback(() => {
		if (selectedProvider === null) {
			setAuthOrigin("landing")
			vscode.postMessage({ type: "rooCloudSignIn", useProviderSignup: true })
			setAuthInProgress(true)
			return
		}

		if (selectedProvider === "roo") {
			if (cloudIsAuthenticated) {
				const rooConfig: ProviderSettings = {
					apiProvider: "roo",
				}
				vscode.postMessage({
					type: "upsertApiConfiguration",
					text: currentApiConfigName,
					apiConfiguration: rooConfig,
				})
			} else {
				setAuthOrigin("providerSelection")
				vscode.postMessage({ type: "rooCloudSignIn", useProviderSignup: true })
				setAuthInProgress(true)
			}
			return
		}

		const error = apiConfiguration ? validateApiConfiguration(apiConfiguration) : undefined
		if (error) {
			setErrorMessage(error)
			return
		}

		setErrorMessage(undefined)
		vscode.postMessage({ type: "upsertApiConfiguration", text: currentApiConfigName, apiConfiguration })
	}, [apiConfiguration, cloudIsAuthenticated, currentApiConfigName, selectedProvider])

	const handleNoAccount = useCallback(() => {
		setSelectedProvider("roo")
	}, [])

	const handleBackToLanding = useCallback(() => {
		setSelectedProvider(null)
		setErrorMessage(undefined)
	}, [])

	const handleGoBack = useCallback(() => {
		setAuthInProgress(false)
		setShowManualEntry(false)
		setManualUrl("")
		setManualErrorMessage(false)

		if (authOrigin !== "providerSelection") {
			setSelectedProvider(null)
		}
		setAuthOrigin(null)
	}, [authOrigin])

	const handleManualUrlChange = (e: any) => {
		const url = e.target.value
		setManualUrl(url)

		setTimeout(() => {
			if (url.trim() && url.includes("://") && url.includes("/auth/clerk/callback")) {
				setManualErrorMessage(false)
				vscode.postMessage({ type: "rooCloudManualUrl", text: url.trim() })
			}
		}, 100)
	}

	const handleSubmit = useCallback(() => {
		const url = manualUrl.trim()
		if (url && url.includes("://") && url.includes("/auth/clerk/callback")) {
			setManualErrorMessage(false)
			vscode.postMessage({ type: "rooCloudManualUrl", text: url })
		} else {
			setManualErrorMessage(true)
		}
	}, [manualUrl])

	const handleOpenSignupUrl = () => {
		vscode.postMessage({ type: "rooCloudSignIn", useProviderSignup: false })
	}

	if (authInProgress) {
		return (
			<Tab>
				<TabContent className="flex flex-col justify-center gap-4 p-6">
					<div className="flex flex-col items-start gap-4 pt-8">
						<VSCodeProgressRing className="size-6" />
						<h2 className="my-0 text-xl font-semibold">正在连接 {CLOUD_BRAND_NAME}...</h2>
						<p className="mt-0 text-vscode-descriptionForeground">
							我们会在浏览器中完成云端登录或授权，然后回到这里继续配置模型与开发环境。
						</p>

						<div className="flex items-start gap-2 pr-4 text-vscode-descriptionForeground">
							<BadgeInfo className="inline size-4 shrink-0" />
							<p className="m-0">
								如果浏览器没有自动打开，点击
								<button
									onClick={handleOpenSignupUrl}
									className="mx-1 cursor-pointer border-none bg-transparent p-0 text-vscode-textLink-foreground underline hover:text-vscode-textLink-activeForeground">
									这里
								</button>
								重新发起登录。
							</p>
						</div>

						<div className="flex items-start gap-2 pr-4 text-vscode-descriptionForeground">
							<TriangleAlert className="inline size-4 shrink-0" />
							<div>
								{!showManualEntry ? (
									<p className="m-0">
										如果已经完成登录但界面没有继续，点击
										<button
											onClick={() => setShowManualEntry(true)}
											className="mx-1 cursor-pointer border-none bg-transparent p-0 text-vscode-textLink-foreground underline hover:text-vscode-textLink-activeForeground">
											这里
										</button>
										手动粘贴回调地址。
									</p>
								) : (
									<div className="w-full max-w-sm">
										<p className="mt-0 text-vscode-descriptionForeground">
											粘贴浏览器中显示的回调地址：
										</p>
										<div className="flex items-center gap-2">
											<VSCodeTextField
												ref={manualUrlInputRef as any}
												value={manualUrl}
												onKeyUp={handleManualUrlChange}
												placeholder="vscode://your-extension-id/auth/clerk/callback?state=..."
												className="flex-1"
											/>
											<Button
												onClick={handleSubmit}
												disabled={manualUrl.length < 40}
												variant="secondary">
												<ArrowRight className="size-4" />
											</Button>
										</div>
										{manualUrl && manualErrorMessage && (
											<p className="mt-2 text-vscode-errorForeground">
												这看起来不是有效的回调地址，请重新复制浏览器中的完整链接。
											</p>
										)}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="mt-4">
						<Button onClick={handleGoBack} variant="secondary">
							<ArrowLeft className="size-4" />
							返回
						</Button>
					</div>
				</TabContent>
			</Tab>
		)
	}

	if (selectedProvider === null) {
		return (
			<Tab>
				<TabContent className="relative flex flex-col justify-center gap-4 p-6">
					<RooHero />
					<h2 className="mb-0 mt-0 text-xl">欢迎使用 {BRAND_NAME}</h2>

					<div className="space-y-4 leading-normal">
						<p className="text-base text-vscode-foreground">{BRAND_INTRO}</p>
						<p className="mb-0 font-semibold">{BRAND_SETUP_HINT}</p>
					</div>

					<div className="mt-2 flex items-center gap-2">
						<Button onClick={handleGetStarted} variant="primary">
							开始配置
						</Button>
						<VSCodeLink onClick={handleNoAccount} className="cursor-pointer">
							直接选择模型提供方
						</VSCodeLink>
					</div>

					<div className="absolute bottom-6 left-6">
						<button
							onClick={() => vscode.postMessage({ type: "importSettings" })}
							className="cursor-pointer border-none bg-transparent p-0 text-vscode-foreground hover:underline">
							导入设置
						</button>
					</div>
				</TabContent>
			</Tab>
		)
	}

	return (
		<Tab>
			<TabContent className="flex flex-col justify-center gap-4 p-6">
				<Brain className="size-8" strokeWidth={1.5} />
				<h2 className="mb-0 mt-0 text-xl">选择模型提供方</h2>

				<p className="text-base text-vscode-foreground">
					{BRAND_NAME} 需要接入一个大模型提供方才能开始工作，后续也可以继续增加更多配置。
				</p>

				<div>
					<VSCodeRadioGroup
						value={selectedProvider}
						onChange={(e: Event | React.FormEvent<HTMLElement>) => {
							const target = ((e as CustomEvent)?.detail?.target ||
								(e.target as HTMLInputElement)) as HTMLInputElement
							setSelectedProvider(target.value as ProviderOption)
						}}>
						<VSCodeRadio value="roo" className="flex items-start gap-2">
							<div className="flex-1 cursor-pointer space-y-1">
								<p className="block -mt-1 text-lg font-semibold">{CLOUD_BRAND_NAME}</p>
								<p className="mt-0 text-base text-vscode-descriptionForeground">
									推荐用于快速开始的托管方案，适合先跑通欢迎页、预览、对话和代码生成流程。
								</p>
							</div>
						</VSCodeRadio>

						<VSCodeRadio value="custom" className="flex items-start gap-2">
							<div className="flex-1 cursor-pointer space-y-1">
								<p className="block -mt-1 text-lg font-semibold">第三方提供方</p>
								<p className="mt-0 text-base text-vscode-descriptionForeground">
									填写你自己的 API Key，使用现有模型服务开始开发。
								</p>
							</div>
						</VSCodeRadio>
					</VSCodeRadioGroup>

					<div className="mb-8 ml-[7px] border-l-2 border-vscode-panel-border pl-6">
						<div
							className={`overflow-clip transition-[max-height] duration-300 ease-in-out ${selectedProvider === "custom" ? "max-h-[600px]" : "max-h-0"}`}>
							<ApiOptions
								fromWelcomeView
								apiConfiguration={apiConfiguration || {}}
								uriScheme={uriScheme}
								setApiConfigurationField={setApiConfigurationFieldForApiOptions}
								errorMessage={errorMessage}
								setErrorMessage={setErrorMessage}
							/>
						</div>
					</div>
				</div>

				<div className="-mt-4 flex gap-2">
					<Button onClick={handleBackToLanding} variant="secondary">
						<ArrowLeft className="size-4" />
						返回
					</Button>
					<Button onClick={handleGetStarted} variant="primary">
						完成配置
					</Button>
				</div>
			</TabContent>
		</Tab>
	)
}

export default WelcomeViewProvider
