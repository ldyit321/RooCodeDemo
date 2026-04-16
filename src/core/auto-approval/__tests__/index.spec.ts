import { checkAutoApproval } from "../index"

describe("checkAutoApproval - HUAYUN secondary dev command fallback", () => {
	it("auto-approves recommended scaffold commands in huayun mode even when global execute auto-approval is off", async () => {
		const result = await checkAutoApproval({
			state: {
				autoApprovalEnabled: false,
				alwaysAllowExecute: false,
				allowedCommands: [],
				deniedCommands: [],
				mode: "huayun-secondary-dev",
			},
			ask: "command",
			text: "pnpm create vite frontend",
		})

		expect(result).toEqual({ decision: "approve" })
	})

	it("keeps asking outside huayun mode when execute auto-approval is off", async () => {
		const result = await checkAutoApproval({
			state: {
				autoApprovalEnabled: false,
				alwaysAllowExecute: false,
				allowedCommands: [],
				deniedCommands: [],
				mode: "code",
			},
			ask: "command",
			text: "pnpm create vite frontend",
		})

		expect(result).toEqual({ decision: "ask" })
	})

	it("auto-denies destructive commands in huayun mode", async () => {
		const result = await checkAutoApproval({
			state: {
				autoApprovalEnabled: false,
				alwaysAllowExecute: false,
				allowedCommands: [],
				deniedCommands: [],
				mode: "huayun-secondary-dev",
			},
			ask: "command",
			text: "rm -rf node_modules",
		})

		expect(result).toEqual({ decision: "deny" })
	})

	it("still respects custom deny rules when global execute auto-approval is enabled", async () => {
		const result = await checkAutoApproval({
			state: {
				autoApprovalEnabled: true,
				alwaysAllowExecute: true,
				allowedCommands: ["pnpm"],
				deniedCommands: ["pnpm install"],
				mode: "huayun-secondary-dev",
			},
			ask: "command",
			text: "pnpm install",
		})

		expect(result).toEqual({ decision: "deny" })
	})
})
