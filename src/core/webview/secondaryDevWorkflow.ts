import * as fs from "fs/promises"
import * as path from "path"

export const HUAYUN_SECONDARY_DEV_MODE_SLUG = "huayun-secondary-dev"

const FRONTEND_DIR_CANDIDATES = ["frontend", "client", "web", "app", "apps/web", ""]
const BACKEND_DIR_CANDIDATES = ["backend", "server", "api", "service", "services", ""]
const FRONTEND_RUN_SCRIPTS = ["dev", "start", "serve", "preview"] as const
const FRONTEND_BUILD_SCRIPTS = ["build", "bundle", "package"] as const
const FRONTEND_OUTPUT_CANDIDATES = ["dist", "build", ".output", "out"]

type PackageManager = "pnpm" | "npm" | "yarn"

type PackageJson = {
	packageManager?: string
	scripts?: Record<string, string>
}

type PythonEntrypointDetection = {
	runCommand: string
	buildCommand?: string
}

export interface SecondaryDevCommandStep {
	label: string
	command: string
	cwd: string
}

export interface SecondaryDevFrontendTarget {
	dir: string
	packageManager: PackageManager
	runScript?: string
	buildScript?: string
}

export interface SecondaryDevBackendTarget {
	dir: string
	runCommand?: string
	buildCommand?: string
}

export interface SecondaryDevWorkspaceTargets {
	frontend?: SecondaryDevFrontendTarget
	backend?: SecondaryDevBackendTarget
}

export interface SecondaryDevPrepareStep {
	label: "frontend-install"
	command: string
	cwd: string
}

export const resolveSecondaryDevBackendInstallCommand = async (
	backendTarget: SecondaryDevBackendTarget,
): Promise<string | undefined> => {
	const requirementsPath = path.join(backendTarget.dir, "requirements.txt")
	if (await pathExists(requirementsPath)) {
		return "python -m pip install -r requirements.txt"
	}

	const pyprojectPath = path.join(backendTarget.dir, "pyproject.toml")
	if (await pathExists(pyprojectPath)) {
		return "python -m pip install -e ."
	}

	return undefined
}

export interface SecondaryDevPackagingEntry {
	source: string
	destination: string
}

export interface SecondaryDevDockerAsset {
	relativePath: string
	content: string
}

export interface SecondaryDevDockerRuntimeConfig {
	frontendRedirectUrl?: string
	backendBaseUrl?: string
}

export interface SecondaryDevDockerPortConfig {
	frontendHostPort: number
	backendHostPort: number
	backendContainerPort: number
}

export type SecondaryDevRunReadinessCode =
	| "missing_frontend"
	| "missing_frontend_script"
	| "missing_backend"
	| "missing_backend_manifest"
	| "missing_backend_env"

export interface SecondaryDevRunReadinessItem {
	code: SecondaryDevRunReadinessCode
	message: string
	path?: string
}

export interface SecondaryDevRunReadiness {
	canRun: boolean
	blockingIssues: SecondaryDevRunReadinessItem[]
	warnings: SecondaryDevRunReadinessItem[]
}

const pathExists = async (targetPath: string) => {
	try {
		await fs.access(targetPath)
		return true
	} catch {
		return false
	}
}

const readPackageJson = async (dir: string): Promise<PackageJson | undefined> => {
	const packageJsonPath = path.join(dir, "package.json")
	if (!(await pathExists(packageJsonPath))) {
		return undefined
	}

	try {
		const raw = await fs.readFile(packageJsonPath, "utf8")
		return JSON.parse(raw) as PackageJson
	} catch {
		return undefined
	}
}

const detectPackageManager = async (dir: string, packageJson?: PackageJson): Promise<PackageManager> => {
	const packageManager = packageJson?.packageManager?.toLowerCase() ?? ""
	if (packageManager.startsWith("pnpm")) {
		return "pnpm"
	}
	if (packageManager.startsWith("yarn")) {
		return "yarn"
	}
	if (packageManager.startsWith("npm")) {
		return "npm"
	}

	if (await pathExists(path.join(dir, "pnpm-lock.yaml"))) {
		return "pnpm"
	}
	if (await pathExists(path.join(dir, "yarn.lock"))) {
		return "yarn"
	}

	return "npm"
}

const toNodeScriptCommand = (packageManager: PackageManager, scriptName: string) =>
	`${packageManager} run ${scriptName}`

const toNodeInstallCommand = (packageManager: PackageManager) => {
	const isWindows = process.platform === "win32"

	switch (packageManager) {
		case "pnpm":
			return isWindows
				? "pnpm install --frozen-lockfile; if (-not $?) { pnpm install }"
				: "pnpm install --frozen-lockfile || pnpm install"
		case "yarn":
			return isWindows
				? "yarn install --frozen-lockfile; if (-not $?) { yarn install }"
				: "yarn install --frozen-lockfile || yarn install"
		case "npm":
		default:
			return isWindows ? "npm ci; if (-not $?) { npm install }" : "npm ci || npm install"
	}
}

const getFirstMatchingScript = (scripts: Record<string, string> | undefined, names: readonly string[]) =>
	names.find((name) => scripts?.[name])

const FRONTEND_DEV_SCRIPT_HINTS = [
	/vite(?:\s|$)/i,
	/webpack-dev-server/i,
	/react-scripts\s+start/i,
	/vue-cli-service\s+serve/i,
	/next\s+dev/i,
	/nuxt(?:\s+\w+)*\s+dev/i,
	/\bastro\s+dev\b/i,
	/\bsvelte-kit\b/i,
	/\bng\s+serve\b/i,
] as const

const FRONTEND_BUILD_SCRIPT_HINTS = [
	/\bvite\s+build\b/i,
	/\bwebpack\b/i,
	/react-scripts\s+build/i,
	/vue-cli-service\s+build/i,
	/\bnext\s+build\b/i,
	/\bnuxt(?:\s+\w+)*\s+build\b/i,
	/\bastro\s+build\b/i,
	/\bng\s+build\b/i,
] as const

const getFirstMatchingScriptByCommand = (
	scripts: Record<string, string> | undefined,
	patterns: readonly RegExp[],
): string | undefined => {
	if (!scripts) {
		return undefined
	}

	return Object.entries(scripts).find(([, command]) => patterns.some((pattern) => pattern.test(command)))?.[0]
}

const detectFrontendRunScript = (scripts: Record<string, string> | undefined) =>
	getFirstMatchingScript(scripts, FRONTEND_RUN_SCRIPTS) ??
	getFirstMatchingScriptByCommand(scripts, FRONTEND_DEV_SCRIPT_HINTS)

const detectFrontendBuildScript = (scripts: Record<string, string> | undefined) =>
	getFirstMatchingScript(scripts, FRONTEND_BUILD_SCRIPTS) ??
	getFirstMatchingScriptByCommand(scripts, FRONTEND_BUILD_SCRIPT_HINTS)

const BACKEND_ENV_FILE_CANDIDATES = [".env", ".env.local", ".env.development", ".env.example"] as const
const FRONTEND_DOCKER_PORT_DEFAULT = 8088
const BACKEND_DOCKER_PORT_DEFAULT = 8000
const LOCAL_URL_PORT_REGEX = /https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::(\d+))?/gi
const LOCAL_PREVIEW_HOST_CANDIDATES = ["localhost", "127.0.0.1", "[::1]"] as const
const BACKEND_PREVIEW_PORT_CANDIDATES = [8000, 8001, 5000, 9000] as const
const FRONTEND_BACKEND_PORT_SCAN_FILES = [
	".env",
	".env.local",
	".env.development",
	".env.production",
	"vite.config.js",
	"vite.config.ts",
	"vite.config.mjs",
	"vite.config.cjs",
	path.join("src", "services", "http.js"),
	path.join("src", "services", "http.ts"),
	path.join("src", "services", "http.tsx"),
] as const

const parsePortFromUrl = (value?: string): number | undefined => {
	if (!value?.trim()) {
		return undefined
	}

	try {
		const parsedUrl = new URL(value.trim())
		if (parsedUrl.port) {
			const parsedPort = Number(parsedUrl.port)
			if (Number.isInteger(parsedPort) && parsedPort > 0) {
				return parsedPort
			}
		}

		if (parsedUrl.protocol === "http:") {
			return 80
		}

		if (parsedUrl.protocol === "https:") {
			return 443
		}
	} catch {
		return undefined
	}

	return undefined
}

const parseBackendPortFromRunCommand = (runCommand?: string): number => {
	if (!runCommand) {
		return BACKEND_DOCKER_PORT_DEFAULT
	}

	const uvicornPortMatch = runCommand.match(/--port\s+(\d{2,5})/)
	if (uvicornPortMatch?.[1]) {
		const parsedPort = Number(uvicornPortMatch[1])
		if (Number.isInteger(parsedPort) && parsedPort > 0) {
			return parsedPort
		}
	}

	const hostPortMatch = runCommand.match(/:(\d{2,5})/)
	if (hostPortMatch?.[1]) {
		const parsedPort = Number(hostPortMatch[1])
		if (Number.isInteger(parsedPort) && parsedPort > 0) {
			return parsedPort
		}
	}

	return BACKEND_DOCKER_PORT_DEFAULT
}

const detectBackendPortFromFrontendTarget = async (
	frontendTarget?: SecondaryDevFrontendTarget,
): Promise<number | undefined> => {
	if (!frontendTarget) {
		return undefined
	}

	for (const relativePath of FRONTEND_BACKEND_PORT_SCAN_FILES) {
		const candidatePath = path.join(frontendTarget.dir, relativePath)
		if (!(await pathExists(candidatePath))) {
			continue
		}

		try {
			const content = await fs.readFile(candidatePath, "utf8")
			const matches = content.matchAll(LOCAL_URL_PORT_REGEX)
			for (const match of matches) {
				const parsedPort = match[1] ? Number(match[1]) : 80
				if (Number.isInteger(parsedPort) && parsedPort > 0) {
					return parsedPort
				}
			}
		} catch {
			// Ignore unreadable frontend config candidates.
		}
	}

	return undefined
}

const PYTHON_ENTRYPOINT_CANDIDATES = [
	path.join("app", "main.py"),
	path.join("src", "app", "main.py"),
	"main.py",
	path.join("src", "main.py"),
] as const

const buildPythonModulePath = (relativeFilePath: string) =>
	relativeFilePath.replace(/\.py$/i, "").split(path.sep).filter(Boolean).join(".")

const detectAsgiAppVariable = (content: string): string | undefined => {
	const declaredAppMatch = content.match(
		/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:FastAPI|Starlette|Litestar|Quart)\s*\(/m,
	)
	if (declaredAppMatch?.[1]) {
		return declaredAppMatch[1]
	}

	const uvicornRunMatch = content.match(/uvicorn\.run\(\s*["']([A-Za-z0-9_.]+):([A-Za-z_][A-Za-z0-9_]*)["']/)
	if (uvicornRunMatch?.[2]) {
		return uvicornRunMatch[2]
	}

	if (/\bapp\s*=/.test(content)) {
		return "app"
	}

	return undefined
}

const detectPythonEntrypoint = async (dir: string): Promise<PythonEntrypointDetection | undefined> => {
	const pyprojectPath = path.join(dir, "pyproject.toml")
	const requirementsPath = path.join(dir, "requirements.txt")
	const hasPythonProject = (await pathExists(pyprojectPath)) || (await pathExists(requirementsPath))
	if (!hasPythonProject) {
		return undefined
	}

	const buildCommand = (await pathExists(pyprojectPath)) ? "python -m build" : undefined

	for (const relativePath of PYTHON_ENTRYPOINT_CANDIDATES) {
		const candidatePath = path.join(dir, relativePath)
		if (!(await pathExists(candidatePath))) {
			continue
		}

		try {
			const content = await fs.readFile(candidatePath, "utf8")
			const uvicornRunMatch = content.match(/uvicorn\.run\(\s*["']([A-Za-z0-9_.]+:[A-Za-z_][A-Za-z0-9_]*)["']/)
			if (uvicornRunMatch?.[1]) {
				return {
					runCommand: `python -m uvicorn ${uvicornRunMatch[1]} --reload`,
					buildCommand,
				}
			}

			const appVariable = detectAsgiAppVariable(content)
			if (appVariable) {
				return {
					runCommand: `python -m uvicorn ${buildPythonModulePath(relativePath)}:${appVariable} --reload`,
					buildCommand,
				}
			}
		} catch {
			// Ignore unreadable candidate entrypoints.
		}

		if (relativePath.endsWith("main.py")) {
			return {
				runCommand: `python ${relativePath.replaceAll(path.sep, "/")}`,
				buildCommand,
			}
		}
	}

	return undefined
}

export const resolveSecondaryDevDockerPortConfig = async (
	targets: SecondaryDevWorkspaceTargets,
	runtimeConfig?: SecondaryDevDockerRuntimeConfig,
): Promise<SecondaryDevDockerPortConfig> => {
	const frontendHostPort = parsePortFromUrl(runtimeConfig?.frontendRedirectUrl) ?? FRONTEND_DOCKER_PORT_DEFAULT
	const backendContainerPort = parseBackendPortFromRunCommand(targets.backend?.runCommand)
	const backendHostPort =
		(await detectBackendPortFromFrontendTarget(targets.frontend)) ??
		parsePortFromUrl(runtimeConfig?.backendBaseUrl) ??
		backendContainerPort

	return {
		frontendHostPort,
		backendHostPort,
		backendContainerPort,
	}
}

export const resolveSecondaryDevBackendPreviewCandidates = async (
	targets: SecondaryDevWorkspaceTargets,
	runtimeConfig?: Pick<SecondaryDevDockerRuntimeConfig, "backendBaseUrl">,
): Promise<string[]> => {
	const ports = new Set<number>()
	const configuredPort = parsePortFromUrl(runtimeConfig?.backendBaseUrl)
	if (configuredPort) {
		ports.add(configuredPort)
	}

	const inferredFrontendBackendPort = await detectBackendPortFromFrontendTarget(targets.frontend)
	if (inferredFrontendBackendPort) {
		ports.add(inferredFrontendBackendPort)
	}

	if (targets.backend?.runCommand) {
		ports.add(parseBackendPortFromRunCommand(targets.backend.runCommand))
	}

	for (const fallbackPort of BACKEND_PREVIEW_PORT_CANDIDATES) {
		ports.add(fallbackPort)
	}

	const candidates: string[] = []
	for (const port of ports) {
		for (const host of LOCAL_PREVIEW_HOST_CANDIDATES) {
			candidates.push(`http://${host}:${port}`)
		}
	}

	return candidates
}

export const discoverSecondaryDevWorkspace = async (cwd: string): Promise<SecondaryDevWorkspaceTargets> => {
	const targets: SecondaryDevWorkspaceTargets = {}

	for (const candidate of FRONTEND_DIR_CANDIDATES) {
		const dir = candidate ? path.join(cwd, candidate) : cwd
		const packageJson = await readPackageJson(dir)
		if (!packageJson?.scripts) {
			continue
		}

		const runScript = detectFrontendRunScript(packageJson.scripts)
		const buildScript = detectFrontendBuildScript(packageJson.scripts)
		if (!runScript && !buildScript) {
			continue
		}

		targets.frontend = {
			dir,
			packageManager: await detectPackageManager(dir, packageJson),
			runScript,
			buildScript,
		}
		break
	}

	for (const candidate of BACKEND_DIR_CANDIDATES) {
		const dir = candidate ? path.join(cwd, candidate) : cwd
		if (!(await pathExists(dir))) {
			continue
		}

		const managePyPath = path.join(dir, "manage.py")
		if (await pathExists(managePyPath)) {
			targets.backend = {
				dir,
				runCommand: "python manage.py runserver",
			}
			break
		}

		const pythonEntrypoint = await detectPythonEntrypoint(dir)
		if (pythonEntrypoint) {
			targets.backend = {
				dir,
				runCommand: pythonEntrypoint.runCommand,
				buildCommand: pythonEntrypoint.buildCommand,
			}
			break
		}
	}

	return targets
}

export const createSecondaryDevRunSteps = (targets: SecondaryDevWorkspaceTargets): SecondaryDevCommandStep[] => {
	const steps: SecondaryDevCommandStep[] = []

	if (targets.backend?.runCommand) {
		steps.push({
			label: "backend",
			command: targets.backend.runCommand,
			cwd: targets.backend.dir,
		})
	}

	if (targets.frontend?.runScript) {
		steps.push({
			label: "frontend",
			command: toNodeScriptCommand(targets.frontend.packageManager, targets.frontend.runScript),
			cwd: targets.frontend.dir,
		})
	}

	return steps
}

export const createSecondaryDevPrepareSteps = async (
	targets: SecondaryDevWorkspaceTargets,
): Promise<SecondaryDevPrepareStep[]> => {
	const steps: SecondaryDevPrepareStep[] = []

	if (targets.frontend) {
		const nodeModulesDir = path.join(targets.frontend.dir, "node_modules")
		if (!(await pathExists(nodeModulesDir))) {
			steps.push({
				label: "frontend-install",
				command: toNodeInstallCommand(targets.frontend.packageManager),
				cwd: targets.frontend.dir,
			})
		}
	}

	return steps
}

export const canRunAndOpenSecondaryDevWorkspace = (targets: SecondaryDevWorkspaceTargets): boolean =>
	Boolean(targets.frontend?.runScript && targets.backend?.runCommand)

export const assessSecondaryDevRunReadiness = async (
	cwd: string,
	targets?: SecondaryDevWorkspaceTargets,
): Promise<SecondaryDevRunReadiness> => {
	const resolvedTargets = targets ?? (await discoverSecondaryDevWorkspace(cwd))
	const blockingIssues: SecondaryDevRunReadinessItem[] = []
	const warnings: SecondaryDevRunReadinessItem[] = []

	if (!resolvedTargets.frontend?.runScript) {
		let packageJsonWithoutRunScript: string | undefined

		for (const candidate of FRONTEND_DIR_CANDIDATES) {
			const dir = candidate ? path.join(cwd, candidate) : cwd
			const packageJson = await readPackageJson(dir)
			if (!packageJson) {
				continue
			}

			const runScript = detectFrontendRunScript(packageJson.scripts)
			if (runScript) {
				break
			}

			packageJsonWithoutRunScript = path.join(dir, "package.json")
			break
		}

		if (packageJsonWithoutRunScript) {
			blockingIssues.push({
				code: "missing_frontend_script",
				message:
					"Frontend package.json was found, but no runnable script (`dev`, `start`, `serve`, or `preview`) is defined yet.",
				path: packageJsonWithoutRunScript,
			})
		} else {
			blockingIssues.push({
				code: "missing_frontend",
				message:
					"No frontend package.json with a runnable dev script was detected. Add a Vue frontend with `dev`, `start`, `serve`, or `preview` first.",
				path: path.join(cwd, "frontend", "package.json"),
			})
		}
	}

	if (!resolvedTargets.backend?.runCommand) {
		let backendEntrypointWithoutManifest: string | undefined

		for (const candidate of BACKEND_DIR_CANDIDATES) {
			const dir = candidate ? path.join(cwd, candidate) : cwd
			if (!(await pathExists(dir))) {
				continue
			}

			const managePyPath = path.join(dir, "manage.py")
			if (await pathExists(managePyPath)) {
				break
			}

			const pyprojectPath = path.join(dir, "pyproject.toml")
			const requirementsPath = path.join(dir, "requirements.txt")
			const hasEntrypoint = (
				await Promise.all(
					PYTHON_ENTRYPOINT_CANDIDATES.map((candidatePath) => pathExists(path.join(dir, candidatePath))),
				)
			).some(Boolean)
			const hasManifest = (await pathExists(pyprojectPath)) || (await pathExists(requirementsPath))

			if (hasEntrypoint && !hasManifest) {
				backendEntrypointWithoutManifest = dir
				break
			}
		}

		if (backendEntrypointWithoutManifest) {
			blockingIssues.push({
				code: "missing_backend_manifest",
				message:
					"Backend Python entrypoint was found, but no `pyproject.toml` or `requirements.txt` was detected. Add one of them so the HUAYUN backend can be recognized and started.",
				path: backendEntrypointWithoutManifest,
			})
		} else {
			blockingIssues.push({
				code: "missing_backend",
				message:
					"No runnable Python backend entry was detected. Expected `backend/app/main.py`, `backend/main.py`, or `backend/manage.py` under a HUAYUN backend directory.",
				path: path.join(cwd, "backend"),
			})
		}
	}

	if (resolvedTargets.backend?.dir) {
		const hasEnvFile = (
			await Promise.all(
				BACKEND_ENV_FILE_CANDIDATES.map((candidate) =>
					pathExists(path.join(resolvedTargets.backend!.dir, candidate)),
				),
			)
		).some(Boolean)

		if (!hasEnvFile) {
			warnings.push({
				code: "missing_backend_env",
				message:
					"Backend environment file was not detected. The run button can still start the backend process, but OAuth2 or upstream config may fail until `.env` or `.env.example` is prepared.",
				path: path.join(resolvedTargets.backend.dir, ".env"),
			})
		}
	}

	return {
		canRun: blockingIssues.length === 0,
		blockingIssues,
		warnings,
	}
}

export const createSecondaryDevBuildSteps = (targets: SecondaryDevWorkspaceTargets): SecondaryDevCommandStep[] => {
	const steps: SecondaryDevCommandStep[] = []

	if (targets.frontend?.buildScript) {
		steps.push({
			label: "frontend-build",
			command: toNodeScriptCommand(targets.frontend.packageManager, targets.frontend.buildScript),
			cwd: targets.frontend.dir,
		})
	}

	if (targets.backend?.buildCommand) {
		steps.push({
			label: "backend-build",
			command: targets.backend.buildCommand,
			cwd: targets.backend.dir,
		})
	}

	return steps
}

const findFrontendPackageSource = async (frontendDir: string): Promise<string> => {
	for (const candidate of FRONTEND_OUTPUT_CANDIDATES) {
		const outputDir = path.join(frontendDir, candidate)
		if (await pathExists(outputDir)) {
			return outputDir
		}
	}

	return frontendDir
}

const findBackendPackageSource = async (backendDir: string): Promise<string> => {
	const distDir = path.join(backendDir, "dist")
	if (await pathExists(distDir)) {
		return distDir
	}

	return backendDir
}

export const resolveSecondaryDevPackagingEntries = async (
	targets: SecondaryDevWorkspaceTargets,
): Promise<SecondaryDevPackagingEntry[]> => {
	const entries: SecondaryDevPackagingEntry[] = []

	if (targets.frontend) {
		entries.push({
			source: await findFrontendPackageSource(targets.frontend.dir),
			destination: "frontend",
		})
	}

	if (targets.backend) {
		entries.push({
			source: await findBackendPackageSource(targets.backend.dir),
			destination: "backend",
		})
	}

	return entries
}

const createFrontendDockerInstallCommand = (packageManager: PackageManager): string => {
	switch (packageManager) {
		case "pnpm":
			return "corepack enable && (pnpm install --frozen-lockfile || pnpm install)"
		case "yarn":
			return "corepack enable && (yarn install --frozen-lockfile || yarn install)"
		case "npm":
		default:
			return "npm ci || npm install"
	}
}

const createFrontendDockerBuildCommand = (target: SecondaryDevFrontendTarget): string => {
	const script = target.buildScript ?? target.runScript ?? "build"

	switch (target.packageManager) {
		case "pnpm":
			return `pnpm run ${script}`
		case "yarn":
			return `yarn ${script}`
		case "npm":
		default:
			return `npm run ${script}`
	}
}

const createBackendDockerCommand = (target: SecondaryDevBackendTarget): string[] => {
	if (target.runCommand?.includes("uvicorn app.main:app")) {
		return ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
	}

	if (target.runCommand?.includes("manage.py runserver")) {
		return ["python", "manage.py", "runserver", "0.0.0.0:8000"]
	}

	return ["python", "main.py"]
}

const createConfiguredBackendDockerCommand = (
	target: SecondaryDevBackendTarget,
	portConfig: SecondaryDevDockerPortConfig,
): string[] =>
	createBackendDockerCommand(target).map((part, index, parts) => {
		if (parts[index - 1] === "--port") {
			return String(portConfig.backendContainerPort)
		}

		if (part === "0.0.0.0:8000") {
			return `0.0.0.0:${portConfig.backendContainerPort}`
		}

		return part
	})

export const createSecondaryDevDockerAssets = (
	targets: SecondaryDevWorkspaceTargets,
	portConfig?: SecondaryDevDockerPortConfig,
): SecondaryDevDockerAsset[] => {
	const assets: SecondaryDevDockerAsset[] = []
	const resolvedPortConfig = portConfig ?? {
		frontendHostPort: FRONTEND_DOCKER_PORT_DEFAULT,
		backendHostPort: BACKEND_DOCKER_PORT_DEFAULT,
		backendContainerPort: BACKEND_DOCKER_PORT_DEFAULT,
	}

	if (targets.frontend) {
		const frontendInstall = createFrontendDockerInstallCommand(targets.frontend.packageManager)
		const frontendBuild = createFrontendDockerBuildCommand(targets.frontend)

		assets.push({
			relativePath: path.join("docker", "frontend-source", "Dockerfile"),
			content: `FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN ${frontendInstall}
RUN ${frontendBuild}

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
		})
	}

	if (targets.backend) {
		const backendCommand = JSON.stringify(createConfiguredBackendDockerCommand(targets.backend, resolvedPortConfig))

		assets.push({
			relativePath: path.join("docker", "backend-source", "Dockerfile"),
			content: `FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
COPY . .
RUN python -m pip install --no-cache-dir --upgrade pip && \\
    if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; \\
    elif [ -f pyproject.toml ]; then pip install --no-cache-dir .; \\
    fi
EXPOSE ${resolvedPortConfig.backendContainerPort}
CMD ${backendCommand}
`,
		})
	}

	if (targets.frontend || targets.backend) {
		const composeServices: string[] = []

		if (targets.frontend) {
			composeServices.push(`  frontend:
    build:
      context: ./frontend-source
      dockerfile: Dockerfile
    ports:
      - "${resolvedPortConfig.frontendHostPort}:80"`)
		}

		if (targets.backend) {
			composeServices.push(`  backend:
    build:
      context: ./backend-source
      dockerfile: Dockerfile
    ports:
      - "${resolvedPortConfig.backendHostPort}:${resolvedPortConfig.backendContainerPort}"`)
		}

		assets.push({
			relativePath: path.join("docker", "docker-compose.yml"),
			content: `services:
${composeServices.join("\n")}
`,
		})

		assets.push({
			relativePath: path.join("docker", "README.md"),
			content: `# HUAYUN Secondary Dev Docker Bundle

This bundle contains Docker build contexts for the generated frontend and backend.

## Build and Run

\`\`\`bash
docker compose up --build
\`\`\`

## Notes

- Frontend is exposed on port \`${resolvedPortConfig.frontendHostPort}\`
- Backend is exposed on port \`${resolvedPortConfig.backendHostPort}\`
- If your backend needs local secrets, prepare \`backend-source/.env\` before running \`docker compose up\`
- Adjust \`docker-compose.yml\` if your deployment platform requires different ports or environment wiring
`,
		})
	}

	return assets
}
