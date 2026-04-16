import * as fs from "fs/promises"
import * as os from "os"
import * as path from "path"

import {
	createSecondaryDevBuildSteps,
	createSecondaryDevRunSteps,
	discoverSecondaryDevWorkspace,
	resolveSecondaryDevPackagingEntries,
} from "../secondaryDevWorkflow"

describe("secondaryDevWorkflow", () => {
	let tempDir: string

	beforeEach(async () => {
		tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "huayun-secondary-dev-"))
	})

	afterEach(async () => {
		await fs.rm(tempDir, { recursive: true, force: true })
	})

	it("discovers common frontend and backend targets and builds run steps", async () => {
		const frontendDir = path.join(tempDir, "frontend")
		const backendDir = path.join(tempDir, "backend")
		await fs.mkdir(frontendDir, { recursive: true })
		await fs.mkdir(path.join(backendDir, "app"), { recursive: true })

		await fs.writeFile(
			path.join(frontendDir, "package.json"),
			JSON.stringify({
				packageManager: "pnpm@10.8.1",
				scripts: {
					dev: "vite",
					build: "vite build",
				},
			}),
		)
		await fs.writeFile(path.join(backendDir, "pyproject.toml"), "[project]\nname='demo'\nversion='0.1.0'\n")
		await fs.writeFile(path.join(backendDir, "app", "main.py"), "app = object()\n")

		const targets = await discoverSecondaryDevWorkspace(tempDir)
		const runSteps = createSecondaryDevRunSteps(targets)
		const buildSteps = createSecondaryDevBuildSteps(targets)

		expect(targets.frontend?.dir).toBe(frontendDir)
		expect(targets.backend?.dir).toBe(backendDir)
		expect(runSteps).toEqual([
			{
				label: "backend",
				command: "python -m uvicorn app.main:app --reload",
				cwd: backendDir,
			},
			{
				label: "frontend",
				command: "pnpm run dev",
				cwd: frontendDir,
			},
		])
		expect(buildSteps).toEqual([
			{
				label: "frontend-build",
				command: "pnpm run build",
				cwd: frontendDir,
			},
			{
				label: "backend-build",
				command: "python -m build",
				cwd: backendDir,
			},
		])
	})

	it("prefers generated build output when resolving packaging entries", async () => {
		const frontendDir = path.join(tempDir, "frontend")
		const backendDir = path.join(tempDir, "backend")
		await fs.mkdir(path.join(frontendDir, "dist"), { recursive: true })
		await fs.mkdir(path.join(backendDir, "dist"), { recursive: true })

		const entries = await resolveSecondaryDevPackagingEntries({
			frontend: {
				dir: frontendDir,
				packageManager: "npm",
				buildScript: "build",
			},
			backend: {
				dir: backendDir,
				buildCommand: "python -m build",
			},
		})

		expect(entries).toEqual([
			{
				source: path.join(frontendDir, "dist"),
				destination: "frontend",
			},
			{
				source: path.join(backendDir, "dist"),
				destination: "backend",
			},
		])
	})
})
