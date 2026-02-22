import { readdirSync, rmSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()

const targets = [".next"]

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name.startsWith(".next_tmp_check_")) {
    targets.push(entry.name)
  }
}

for (const target of targets) {
  rmSync(join(root, target), { recursive: true, force: true })
}
