import fs from "node:fs/promises"
import path from "node:path"

type MessageBlock =
	| {
			type: "text"
			text: string
	  }
	| {
			type: "tool_use"
			id?: string
			name?: string
			input?: unknown
	  }
	| {
			type: "tool_result"
			tool_use_id?: string
			content?: unknown
			is_error?: boolean
	  }
	| {
			type: "reasoning"
			text?: string
			summary?: unknown[]
			encrypted_content?: string
	  }
	| {
			type: string
			[key: string]: unknown
	  }

type ApiMessage = {
	role: "user" | "assistant"
	content: string | MessageBlock[]
	ts?: number
	id?: string
	isSummary?: boolean
	condenseId?: string
	condenseParent?: string
	truncationId?: string
	truncationParent?: string
	isTruncationMarker?: boolean
}

type NormalizedBlock = {
	type: string
	text?: string
	id?: string
	name?: string
	input?: unknown
	toolUseId?: string
	content?: unknown
	isError?: boolean
	meta?: Record<string, unknown>
}

type NormalizedMessage = {
	index: number
	role: "user" | "assistant"
	ts?: number
	flags: {
		isSummary: boolean
		isTruncationMarker: boolean
		condenseId?: string
		condenseParent?: string
		truncationId?: string
		truncationParent?: string
	}
	blocks: NormalizedBlock[]
}

type Round = {
	round: number
	requestMessages: NormalizedMessage[]
	assistantMessage: NormalizedMessage
}

type OutputMode = "human" | "json"

function printUsageAndExit(): never {
	console.error(`Usage:
  pnpm tsx scripts/print-api-rounds.ts <task-dir-or-api-history-file> [--json] [--pretty]

Examples:
  pnpm tsx scripts/print-api-rounds.ts "D:\\path\\to\\task-id"
  pnpm tsx scripts/print-api-rounds.ts "D:\\path\\to\\task-id" --json --pretty
  pnpm tsx scripts/print-api-rounds.ts "D:\\path\\to\\api_conversation_history.json"
`)
	process.exit(1)
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null
}

function normalizeBlock(block: MessageBlock | { type: "text"; text: string }): NormalizedBlock {
	if (!isObject(block)) {
		return {
			type: "unknown",
			content: block,
		}
	}

	switch (block.type) {
		case "text":
			return {
				type: "text",
				text: typeof block.text === "string" ? block.text : String(block.text ?? ""),
			}
		case "tool_use":
			return {
				type: "tool_use",
				id: typeof block.id === "string" ? block.id : undefined,
				name: typeof block.name === "string" ? block.name : undefined,
				input: block.input,
			}
		case "tool_result":
			return {
				type: "tool_result",
				toolUseId: typeof block.tool_use_id === "string" ? block.tool_use_id : undefined,
				content: block.content,
				isError: Boolean(block.is_error),
			}
		case "reasoning":
			return {
				type: "reasoning",
				text: typeof block.text === "string" ? block.text : undefined,
				meta: {
					summary: Array.isArray(block.summary) ? block.summary : [],
					encrypted_content:
						typeof block.encrypted_content === "string" ? block.encrypted_content : undefined,
				},
			}
		default: {
			const { type, ...rest } = block
			return {
				type,
				meta: rest,
			}
		}
	}
}

function normalizeMessage(message: ApiMessage, index: number): NormalizedMessage {
	const blocks = Array.isArray(message.content)
		? message.content.map((block) => normalizeBlock(block))
		: [normalizeBlock({ type: "text", text: String(message.content ?? "") })]

	return {
		index,
		role: message.role,
		ts: message.ts,
		flags: {
			isSummary: Boolean(message.isSummary),
			isTruncationMarker: Boolean(message.isTruncationMarker),
			condenseId: message.condenseId,
			condenseParent: message.condenseParent,
			truncationId: message.truncationId,
			truncationParent: message.truncationParent,
		},
		blocks,
	}
}

function buildRounds(messages: ApiMessage[]): Round[] {
	const rounds: Round[] = []
	let pendingRequestMessages: NormalizedMessage[] = []

	messages.forEach((message, index) => {
		const normalized = normalizeMessage(message, index)

		if (message.role === "user") {
			pendingRequestMessages.push(normalized)
			return
		}

		rounds.push({
			round: rounds.length + 1,
			requestMessages: pendingRequestMessages,
			assistantMessage: normalized,
		})
		pendingRequestMessages = []
	})

	return rounds
}

function buildStats(messages: ApiMessage[], rounds: Round[]) {
	const normalizedMessages = messages.map((message, index) => normalizeMessage(message, index))

	const assistantMessages = normalizedMessages.filter((message) => message.role === "assistant")
	const userMessages = normalizedMessages.filter((message) => message.role === "user")
	const toolUseCount = normalizedMessages
		.flatMap((message) => message.blocks)
		.filter((block) => block.type === "tool_use").length
	const toolResultCount = normalizedMessages
		.flatMap((message) => message.blocks)
		.filter((block) => block.type === "tool_result").length

	return {
		totalMessages: normalizedMessages.length,
		userMessages: userMessages.length,
		assistantMessages: assistantMessages.length,
		rounds: rounds.length,
		toolUseCount,
		toolResultCount,
	}
}

function formatTimestamp(ts?: number): string {
	if (!ts) {
		return "-"
	}

	return new Date(ts).toLocaleString("zh-CN", { hour12: false })
}

function truncateText(text: string, maxLength: number = 180): string {
	const normalized = text.replace(/\s+/g, " ").trim()
	if (normalized.length <= maxLength) {
		return normalized
	}
	return `${normalized.slice(0, maxLength - 3)}...`
}

function stringifyValue(value: unknown, maxLength: number = 220): string {
	if (typeof value === "string") {
		return truncateText(value, maxLength)
	}

	try {
		return truncateText(JSON.stringify(value), maxLength)
	} catch {
		return truncateText(String(value), maxLength)
	}
}

function formatFlags(message: NormalizedMessage): string[] {
	const flags: string[] = []
	if (message.flags.isSummary) {
		flags.push("summary")
	}
	if (message.flags.isTruncationMarker) {
		flags.push("truncation-marker")
	}
	if (message.flags.condenseId) {
		flags.push(`condenseId=${message.flags.condenseId}`)
	}
	if (message.flags.condenseParent) {
		flags.push(`condenseParent=${message.flags.condenseParent}`)
	}
	if (message.flags.truncationId) {
		flags.push(`truncationId=${message.flags.truncationId}`)
	}
	if (message.flags.truncationParent) {
		flags.push(`truncationParent=${message.flags.truncationParent}`)
	}
	return flags
}

function renderBlock(block: NormalizedBlock): string[] {
	switch (block.type) {
		case "text":
			return [`text: ${truncateText(block.text ?? "")}`]
		case "reasoning":
			return [`reasoning: ${truncateText(block.text ?? "[encrypted or structured reasoning]")}`]
		case "tool_use":
			return [
				`tool_use: ${block.name ?? "<unknown>"}${block.id ? ` (id=${block.id})` : ""}`,
				`input: ${stringifyValue(block.input)}`,
			]
		case "tool_result":
			return [
				`tool_result: ${block.toolUseId ?? "<unknown>"}${block.isError ? " [error]" : ""}`,
				`content: ${stringifyValue(block.content)}`,
			]
		default:
			return [`${block.type}: ${stringifyValue(block.meta ?? block.content ?? "")}`]
	}
}

function renderMessage(message: NormalizedMessage, label: string): string[] {
	const lines: string[] = []
	const flags = formatFlags(message)
	const suffix = flags.length > 0 ? ` | flags: ${flags.join(", ")}` : ""

	lines.push(`${label} #${message.index} @ ${formatTimestamp(message.ts)}${suffix}`)

	if (message.blocks.length === 0) {
		lines.push("  (empty)")
		return lines
	}

	for (const block of message.blocks) {
		const blockLines = renderBlock(block)
		for (const [index, line] of blockLines.entries()) {
			lines.push(index === 0 ? `  - ${line}` : `    ${line}`)
		}
	}

	return lines
}

function renderHumanReadable(
	historyFile: string,
	messages: ApiMessage[],
	rounds: Round[],
	stats: ReturnType<typeof buildStats>,
): string {
	const lines: string[] = []

	lines.push(`Source: ${historyFile}`)
	lines.push(
		`Stats: rounds=${stats.rounds}, messages=${stats.totalMessages}, user=${stats.userMessages}, assistant=${stats.assistantMessages}, tool_use=${stats.toolUseCount}, tool_result=${stats.toolResultCount}`,
	)

	if (rounds.length === 0) {
		lines.push("")
		lines.push("No assistant rounds found in this history.")
		return lines.join("\n")
	}

	for (const round of rounds) {
		lines.push("")
		lines.push(`=== Round ${round.round} ===`)

		if (round.requestMessages.length === 0) {
			lines.push("(no request messages before this assistant turn)")
		} else {
			lines.push("Request:")
			for (const message of round.requestMessages) {
				lines.push(...renderMessage(message, message.role.toUpperCase()))
			}
		}

		lines.push("Assistant:")
		lines.push(...renderMessage(round.assistantMessage, "ASSISTANT"))
	}

	const lastMessage = messages[messages.length - 1]
	if (lastMessage?.role === "user") {
		lines.push("")
		lines.push("Trailing user message:")
		lines.push(...renderMessage(normalizeMessage(lastMessage, messages.length - 1), "USER"))
	}

	return lines.join("\n")
}

async function resolveHistoryFile(inputPath: string): Promise<string> {
	const resolved = path.resolve(inputPath)
	const stat = await fs.stat(resolved)

	if (stat.isDirectory()) {
		return path.join(resolved, "api_conversation_history.json")
	}

	return resolved
}

async function main() {
	const args = process.argv.slice(2)
	const outputMode: OutputMode = args.includes("--json") ? "json" : "human"
	const pretty = args.includes("--pretty")
	const targetArg = args.find((arg) => !arg.startsWith("--"))

	if (!targetArg) {
		printUsageAndExit()
	}

	const historyFile = await resolveHistoryFile(targetArg)
	const raw = await fs.readFile(historyFile, "utf8")
	const messages = JSON.parse(raw.replace(/^\uFEFF/, "")) as ApiMessage[]

	if (!Array.isArray(messages)) {
		throw new Error(`Expected an array in ${historyFile}`)
	}

	const rounds = buildRounds(messages)
	const stats = buildStats(messages, rounds)
	const result = {
		source: historyFile,
		stats,
		rounds,
	}

	if (outputMode === "json") {
		console.log(JSON.stringify(result, null, pretty ? 2 : 0))
		return
	}

	console.log(renderHumanReadable(historyFile, messages, rounds, stats))
}

main().catch((error) => {
	console.error(error instanceof Error ? (error.stack ?? error.message) : String(error))
	process.exit(1)
})
