import { resolve } from "node:path"

/** Resolve paths relative to the automation package root (`process.cwd()` when you run tests from `automation/`). */
export function resolvePath(...segments: string[]): string {
  return resolve(process.cwd(), ...segments)
}
