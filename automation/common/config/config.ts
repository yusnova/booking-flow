import * as dotenv from "dotenv"
import { resolvePath } from "common/helpers/resolve-path"

dotenv.config({ path: resolvePath(".env") })

function readEnv(name: string, fallback: string): string {
  const v = process.env[name]
  return v != null && v.trim() !== "" ? v.trim() : fallback
}

export type ConfigEnv = {
  baseURL: string
  webServerUrl: string
  uiProjectDir: string
  webServerCommand: string
}

export const configEnv: ConfigEnv = {
  baseURL: readEnv("BASE_URL", "http://127.0.0.1:3000/"),
  webServerUrl: readEnv("WEB_SERVER_URL", readEnv("BASE_URL", "http://127.0.0.1:3000/")),
  uiProjectDir: readEnv("UI_PROJECT_DIR", "../ui"),
  webServerCommand: readEnv("WEB_SERVER_COMMAND", "npm run dev")
}
