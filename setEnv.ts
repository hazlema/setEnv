import { createReadStream } from "node:fs"
import { createInterface } from "node:readline"
import { Readable } from "node:stream"
import type { BunFile } from "bun"

const setEnv = async (envPath: string = ".env"): Promise<void> => {
    const file: BunFile = Bun.file(envPath)

    if (file.name && (await file.exists())) {
        const fileStream: Readable = createReadStream(file.name)

        const rl = createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        })

        for await (const line of rl) {
            if (line.startsWith("#") || line.trim() === "") continue

            if (line.includes("=")) {
                const [key, ...valueParts] = line.split("=")
                const value = valueParts.join("=").trim() // Handle values containing '='

                if (key && value) {
                    process.env[key.trim()] = value
                }
            }
        }
    }
}

export default setEnv
