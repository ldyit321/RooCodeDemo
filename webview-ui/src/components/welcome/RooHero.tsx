import { Globe, MonitorPlay, Sparkles } from "lucide-react"

import { Button } from "@src/components/ui"
import {
	BRAND_HEADLINE,
	BRAND_NAME,
	EXPERIENCE_WEBSITE_URL,
	OFFICIAL_WEBSITE_URL,
	PRODUCT_DESCRIPTION,
	PRODUCT_NAME,
} from "@src/constants/branding"

const RooHero = () => {
	return (
		<div className="mb-4 relative w-full max-w-[640px] overflow-hidden rounded-[28px] border border-vscode-panel-border bg-[radial-gradient(circle_at_top_left,rgba(57,121,255,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(12,168,120,0.18),transparent_34%),var(--vscode-sideBar-background)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)] forced-color-adjust-none">
			<div className="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
			<div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
			<div className="relative flex flex-col gap-4">
				<div className="inline-flex w-fit items-center gap-2 rounded-full border border-vscode-panel-border bg-vscode-editor-background/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-vscode-descriptionForeground">
					<Sparkles className="size-3.5" />
					<span>{BRAND_NAME}</span>
				</div>

				<div className="space-y-2">
					<p className="m-0 text-sm font-medium text-vscode-descriptionForeground">{PRODUCT_NAME}</p>
					<h1 className="m-0 text-3xl font-semibold tracking-tight text-vscode-foreground">
						{BRAND_HEADLINE}
					</h1>
					<p className="m-0 max-w-[560px] text-sm leading-6 text-vscode-descriptionForeground">
						{PRODUCT_DESCRIPTION}
					</p>
				</div>

				<div className="flex flex-wrap gap-3 pt-1">
					<Button asChild variant="primary">
						<a href={OFFICIAL_WEBSITE_URL} target="_blank" rel="noreferrer">
							<Globe className="size-4" />
							官网入口
						</a>
					</Button>
					<Button asChild variant="outline">
						<a href={EXPERIENCE_WEBSITE_URL} target="_blank" rel="noreferrer">
							<MonitorPlay className="size-4" />
							在线体验
						</a>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default RooHero
