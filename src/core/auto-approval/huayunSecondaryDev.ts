export const HUAYUN_SECONDARY_DEV_MODE_SLUG = "huayun-secondary-dev"

// Safe command prefixes commonly used while scaffolding or building
// secondary-development projects. These are intentionally scoped to
// setup/install/build flows rather than arbitrary shell execution.
export const HUAYUN_SECONDARY_DEV_ALLOWED_COMMAND_PREFIXES = [
	"mkdir ",
	"mkdir\t",
	"md ",
	"new-item ",
	"copy ",
	"cp ",
	"move ",
	"mv ",
	"ren ",
	"rename ",
	"npm create ",
	"npm init ",
	"npm install ",
	"npm run build",
	"npm run lint",
	"npm run test",
	"pnpm create ",
	"pnpm dlx ",
	"pnpm init ",
	"pnpm install ",
	"pnpm add ",
	"pnpm run build",
	"pnpm run lint",
	"pnpm run test",
	"npx create-",
	"npx vite",
	"npx degit",
	"yarn create ",
	"yarn install ",
	"yarn add ",
	"yarn build",
	"yarn test",
	"bun create ",
	"bun install ",
	"bun add ",
	"uv venv",
	"uv sync",
	"uv add ",
	"uv pip install ",
	"python -m venv",
	"python -m pip install ",
	"py -m venv",
	"py -m pip install ",
	"pip install ",
	"poetry init",
	"poetry install",
	"poetry add ",
]

// Explicitly blocked destructive prefixes. These remain denied even when
// HUAYUN mode enables recommended command auto-approval.
export const HUAYUN_SECONDARY_DEV_DENIED_COMMAND_PREFIXES = [
	"rm ",
	"rm\t",
	"del ",
	"erase ",
	"rmdir ",
	"rd ",
	"remove-item ",
	"format ",
	"shutdown ",
	"reboot ",
	"git reset --hard",
	"git clean ",
]

export function isHuayunSecondaryDevMode(mode?: string): boolean {
	return mode === HUAYUN_SECONDARY_DEV_MODE_SLUG
}

export function mergeUniqueCommandPrefixes(...lists: Array<string[] | undefined>): string[] {
	return Array.from(
		new Set(
			lists
				.flatMap((list) => list ?? [])
				.map((prefix) => prefix.trim())
				.filter((prefix) => prefix.length > 0),
		),
	)
}
