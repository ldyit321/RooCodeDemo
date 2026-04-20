import * as fs from "fs/promises"
import * as os from "os"
import * as path from "path"

import {
	assessSecondaryDevRunReadiness,
	canRunAndOpenSecondaryDevWorkspace,
	createSecondaryDevBuildSteps,
	createSecondaryDevDockerAssets,
	createSecondaryDevPrepareSteps,
	createSecondaryDevRunSteps,
	discoverSecondaryDevWorkspace,
	resolveSecondaryDevBackendInstallCommand,
	resolveSecondaryDevDockerPortConfig,
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
		expect(canRunAndOpenSecondaryDevWorkspace(targets)).toBe(true)
		const readiness = await assessSecondaryDevRunReadiness(tempDir, targets)
		expect(readiness.canRun).toBe(true)
		expect(readiness.warnings).toEqual([
			expect.objectContaining({
				code: "missing_backend_env",
			}),
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

	it("creates docker-ready assets for detected frontend and backend targets", async () => {
		const assets = createSecondaryDevDockerAssets({
			frontend: {
				dir: path.join(tempDir, "frontend"),
				packageManager: "pnpm",
				runScript: "dev",
				buildScript: "build",
			},
			backend: {
				dir: path.join(tempDir, "backend"),
				runCommand: "python -m uvicorn app.main:app --reload",
			},
		})

		expect(assets).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					relativePath: path.join("docker", "frontend-source", "Dockerfile"),
					content: expect.stringContaining("FROM node:20-alpine AS build"),
				}),
				expect.objectContaining({
					relativePath: path.join("docker", "backend-source", "Dockerfile"),
					content: expect.stringContaining(
						'CMD ["python","-m","uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]',
					),
				}),
				expect.objectContaining({
					relativePath: path.join("docker", "docker-compose.yml"),
					content: expect.stringContaining("frontend:"),
				}),
			]),
		)
	})

	it("derives docker ports from secondary dev config and frontend local api wiring", async () => {
		const frontendDir = path.join(tempDir, "frontend")
		await fs.mkdir(path.join(frontendDir, "src", "services"), { recursive: true })
		await fs.writeFile(
			path.join(frontendDir, "src", "services", "http.js"),
			'export const apiBase = "http://localhost:3100/api"\n',
		)

		const portConfig = await resolveSecondaryDevDockerPortConfig(
			{
				frontend: {
					dir: frontendDir,
					packageManager: "pnpm",
					runScript: "dev",
					buildScript: "build",
				},
				backend: {
					dir: path.join(tempDir, "backend"),
					runCommand: "python -m uvicorn app.main:app --reload",
				},
			},
			{
				frontendRedirectUrl: "http://localhost:3000/oauth/callback",
				backendBaseUrl: "https://cad.crowncad.com",
			},
		)

		expect(portConfig).toEqual({
			frontendHostPort: 3000,
			backendHostPort: 3100,
			backendContainerPort: 8000,
		})
	})

	it("requires both frontend and backend run targets before enabling run and open", async () => {
		const frontendDir = path.join(tempDir, "frontend")
		await fs.mkdir(frontendDir, { recursive: true })
		await fs.writeFile(
			path.join(frontendDir, "package.json"),
			JSON.stringify({
				packageManager: "pnpm@10.8.1",
				scripts: {
					dev: "vite",
				},
			}),
		)

		const targets = await discoverSecondaryDevWorkspace(tempDir)

		expect(canRunAndOpenSecondaryDevWorkspace(targets)).toBe(false)
		const readiness = await assessSecondaryDevRunReadiness(tempDir, targets)
		expect(readiness.canRun).toBe(false)
		expect(readiness.blockingIssues).toEqual([
			expect.objectContaining({
				code: "missing_backend",
			}),
		])
	})

	it("adds a frontend install preparation step when node_modules is missing", async () => {
		const frontendDir = path.join(tempDir, "frontend")
		await fs.mkdir(frontendDir, { recursive: true })
		await fs.writeFile(
			path.join(frontendDir, "package.json"),
			JSON.stringify({
				packageManager: "pnpm@10.8.1",
				scripts: {
					dev: "vite",
				},
			}),
		)

		const targets = await discoverSecondaryDevWorkspace(tempDir)
		const prepareSteps = await createSecondaryDevPrepareSteps(targets)

		expect(prepareSteps).toEqual([
			{
				label: "frontend-install",
				command:
					process.platform === "win32"
						? "pnpm install --frozen-lockfile; if (-not $?) { pnpm install }"
						: "pnpm install --frozen-lockfile || pnpm install",
				cwd: frontendDir,
			},
		])
	})

	it("detects custom frontend dev and build scripts from script commands", async () => {
		const frontendDir = path.join(tempDir, "frontend")
		await fs.mkdir(frontendDir, { recursive: true })
		await fs.writeFile(
			path.join(frontendDir, "package.json"),
			JSON.stringify({
				packageManager: "npm@10.8.1",
				scripts: {
					client: "vite --host 0.0.0.0",
					"bundle:web": "vite build",
				},
			}),
		)

		const targets = await discoverSecondaryDevWorkspace(tempDir)

		expect(targets.frontend).toEqual({
			dir: frontendDir,
			packageManager: "npm",
			runScript: "client",
			buildScript: "bundle:web",
		})
	})

	it("detects python ASGI entrypoints from src/app/main.py", async () => {
		const backendDir = path.join(tempDir, "backend")
		await fs.mkdir(path.join(backendDir, "src", "app"), { recursive: true })
		await fs.writeFile(path.join(backendDir, "pyproject.toml"), "[project]\nname='demo'\nversion='0.1.0'\n")
		await fs.writeFile(
			path.join(backendDir, "src", "app", "main.py"),
			"from fastapi import FastAPI\napi = FastAPI()\n",
		)

		const targets = await discoverSecondaryDevWorkspace(tempDir)

		expect(targets.backend).toEqual({
			dir: backendDir,
			runCommand: "python -m uvicorn src.app.main:api --reload",
			buildCommand: "python -m build",
		})
	})

	it("prefers editable install for pyproject based backends", async () => {
		const backendDir = path.join(tempDir, "backend")
		await fs.mkdir(backendDir, { recursive: true })
		await fs.writeFile(path.join(backendDir, "pyproject.toml"), "[project]\nname='demo'\nversion='0.1.0'\n")

		const installCommand = await resolveSecondaryDevBackendInstallCommand({
			dir: backendDir,
			runCommand: "python -m uvicorn app.main:app --reload",
		})

		expect(installCommand).toBe("python -m pip install -e .")
	})

	it("reports a backend manifest issue when app.main exists without pyproject or requirements", async () => {
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
				},
			}),
		)
		await fs.writeFile(path.join(backendDir, "app", "main.py"), "app = object()\n")

		const targets = await discoverSecondaryDevWorkspace(tempDir)
		const readiness = await assessSecondaryDevRunReadiness(tempDir, targets)

		expect(readiness.canRun).toBe(false)
		expect(readiness.blockingIssues).toEqual([
			expect.objectContaining({
				code: "missing_backend_manifest",
			}),
		])
	})
})
