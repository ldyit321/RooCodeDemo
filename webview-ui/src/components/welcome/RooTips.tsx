import { VSCodeLink } from "@vscode/webview-ui-toolkit/react"
import { Boxes, Globe, MonitorPlay } from "lucide-react"

import {
	BRAND_INTRO,
	BRAND_NAME,
	EXPERIENCE_WEBSITE_URL,
	OFFICIAL_WEBSITE_URL,
	PRODUCT_NAME,
} from "@src/constants/branding"

const tips = [
	{
		icon: <Globe className="size-4 shrink-0 mt-0.5" />,
		href: OFFICIAL_WEBSITE_URL,
		title: "官网资料",
		description: `查看 ${PRODUCT_NAME} 的产品介绍、能力边界与最新资料。`,
	},
	{
		icon: <MonitorPlay className="size-4 shrink-0 mt-0.5" />,
		href: EXPERIENCE_WEBSITE_URL,
		title: "在线体验",
		description: "直接进入云端 CAD 环境，快速感受界面与协同设计流程。",
	},
]

const RooTips = () => {
	return (
		<div className="mb-4 flex max-w-[500px] flex-col gap-2 text-vscode-descriptionForeground">
			<p className="my-0 pr-2">{BRAND_INTRO}</p>

			<div className="gap-4">
				{tips.map((tip) => (
					<div key={tip.title} className="mr-6 mt-2 flex items-start gap-2 leading-relaxed">
						{tip.icon}
						<span>
							<VSCodeLink className="text-muted-foreground underline" href={tip.href}>
								{tip.title}
							</VSCodeLink>
							: {tip.description}
						</span>
					</div>
				))}
			</div>

			<p className="my-0 flex items-start gap-2 pr-8">
				<Boxes className="mt-0.5 size-4 shrink-0" />
				<span>{BRAND_NAME} 适合继续沉淀 API 约束、二开规范与专属工作流，让 AI 更懂你的 CAD 业务场景。</span>
			</p>
		</div>
	)
}

export default RooTips
