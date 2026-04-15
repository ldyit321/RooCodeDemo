import { useState } from "react"
import { useTranslation } from "react-i18next"

import type { HistoryItem } from "@roo-code/types"

import { vscode } from "@/utils/vscode"
import { useCopyToClipboard } from "@/utils/clipboard"
import { useExtensionState } from "@/context/ExtensionStateContext"

import { DeleteTaskDialog } from "../history/DeleteTaskDialog"
import { ShareButton } from "./ShareButton"
import {
	CopyIcon,
	CheckIcon,
	DownloadIcon,
	Trash2Icon,
	FileJsonIcon,
	MessageSquareCodeIcon,
	EyeIcon,
	PlayIcon,
	PackageIcon,
} from "lucide-react"
import { LucideIconButton } from "./LucideIconButton"

interface TaskActionsProps {
	item?: HistoryItem
	buttonsDisabled: boolean
}

export const TaskActions = ({ item, buttonsDisabled }: TaskActionsProps) => {
	const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
	const { t } = useTranslation()
	const { copyWithFeedback, showCopyFeedback } = useCopyToClipboard()
	const { debug, mode } = useExtensionState()
	const isHuayunSecondaryDevMode = mode === "huayun-secondary-dev"

	return (
		<div className="flex flex-row items-center -ml-0.5 mt-1 gap-1">
			<LucideIconButton
				icon={DownloadIcon}
				title={t("chat:task.export")}
				onClick={() => vscode.postMessage({ type: "exportCurrentTask" })}
			/>
			{isHuayunSecondaryDevMode && (
				<>
					<LucideIconButton
						icon={PlayIcon}
						title="Run secondary dev workspace"
						onClick={() => vscode.postMessage({ type: "runSecondaryDevWorkspace" })}
					/>
					<LucideIconButton
						icon={PackageIcon}
						title="Package secondary dev workspace"
						onClick={() => vscode.postMessage({ type: "packageSecondaryDevWorkspace" })}
					/>
				</>
			)}
			<LucideIconButton
				icon={EyeIcon}
				title="Preview frontend"
				onClick={() => vscode.postMessage({ type: "openFrontendPreview" })}
			/>

			{item?.task && (
				<LucideIconButton
					icon={showCopyFeedback ? CheckIcon : CopyIcon}
					title={t("history:copyPrompt")}
					onClick={(e) => copyWithFeedback(item.task, e)}
				/>
			)}
			{!!item?.size && item.size > 0 && (
				<>
					<LucideIconButton
						icon={Trash2Icon}
						title={t("chat:task.delete")}
						disabled={buttonsDisabled}
						onClick={(e) => {
							e.stopPropagation()
							if (e.shiftKey) {
								vscode.postMessage({ type: "deleteTaskWithId", text: item.id })
							} else {
								setDeleteTaskId(item.id)
							}
						}}
					/>
					{deleteTaskId && (
						<DeleteTaskDialog
							taskId={deleteTaskId}
							onOpenChange={(open) => !open && setDeleteTaskId(null)}
							open
						/>
					)}
				</>
			)}
			<ShareButton item={item} disabled={false} />
			{debug && item?.id && (
				<>
					<LucideIconButton
						icon={FileJsonIcon}
						title={t("chat:task.openApiHistory")}
						onClick={() => vscode.postMessage({ type: "openDebugApiHistory" })}
					/>
					<LucideIconButton
						icon={MessageSquareCodeIcon}
						title={t("chat:task.openUiHistory")}
						onClick={() => vscode.postMessage({ type: "openDebugUiHistory" })}
					/>
				</>
			)}
		</div>
	)
}
