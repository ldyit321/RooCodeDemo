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

export interface SecondaryDevPackagingEntry {
	source: string
	destination: string
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

const getFirstMatchingScript = (scripts: Record<string, string> | undefined, names: readonly string[]) =>
	names.find((name) => scripts?.[name])

export const discoverSecondaryDevWorkspace = async (cwd: string): Promise<SecondaryDevWorkspaceTargets> => {
	const targets: SecondaryDevWorkspaceTargets = {}

	for (const candidate of FRONTEND_DIR_CANDIDATES) {
		const dir = candidate ? path.join(cwd, candidate) : cwd
		const packageJson = await readPackageJson(dir)
		if (!packageJson?.scripts) {
			continue
		}

		const runScript = getFirstMatchingScript(packageJson.scripts, FRONTEND_RUN_SCRIPTS)
		const buildScript = getFirstMatchingScript(packageJson.scripts, FRONTEND_BUILD_SCRIPTS)
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

		const appMainPath = path.join(dir, "app", "main.py")
		const mainPyPath = path.join(dir, "main.py")
		const pyprojectPath = path.join(dir, "pyproject.toml")
		const requirementsPath = path.join(dir, "requirements.txt")
		const hasPythonProject = (await pathExists(pyprojectPath)) || (await pathExists(requirementsPath))

		if ((await pathExists(appMainPath)) && hasPythonProject) {
			targets.backend = {
				dir,
				runCommand: "python -m uvicorn app.main:app --reload",
				buildCommand: (await pathExists(pyprojectPath)) ? "python -m build" : undefined,
			}
			break
		}

		if ((await pathExists(mainPyPath)) && hasPythonProject) {
			targets.backend = {
				dir,
				runCommand: "python main.py",
				buildCommand: (await pathExists(pyprojectPath)) ? "python -m build" : undefined,
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
