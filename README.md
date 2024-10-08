# Lightweight .env File Loader for Bun

`setEnv` is a simple, efficient function for loading environment variables from a `.env` file in Bun applications. It's designed to be a lightweight alternative to full-featured dotenv libraries, perfect for projects that need basic .env functionality without additional overhead.

## Features

- Lightweight: Just 43 lines of code
- Configurable: Supports custom .env file paths
- Efficient: Uses Bun's native file APIs and Node.js streams for optimal performance
- TypeScript support: Fully typed for improved developer experience
- Cross-platform compatible: Handles different line ending styles (CRLF, LF, CR)
- Comment support: Ignores lines starting with #
- Handles complex values: Correctly processes values containing = characters
- Variable expansion: Supports referencing other environment variables using $VARIABLE_NAME syntax

## Installation

No installation required! Just copy the `setEnv` function into your project.

## Usage

1. Copy the `setEnv` function into your project, for example in a file named `setEnv.ts`:

```typescript
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import type { BunFile } from "bun";

const setEnv = async (envPath: string = ".env"): Promise<void> => {
  const file: BunFile = Bun.file(envPath);

  if (file.name && (await file.exists())) {
    const fileStream: Readable = createReadStream(file.name);

    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      if (line.startsWith("#") || line.trim() === "") continue;

      if (line.includes("=")) {
        let [key, ...valueParts] = line.split("=");
        let value = valueParts.join("=").trim();

        key = key.trim();

        Object.keys(process.env).forEach((envKey) => {
          if (process.env[envKey]) {
            const placeholder: string = "$" + envKey;

            if (value.includes(placeholder)) {
              value = value.replace(placeholder, process.env[envKey] as string);
            }
          }
        });

        if (key && value) {
          process.env[key] = value;
        }
      }
    }
  }
};

export default setEnv;
```

2. In your main application file, import and call `setEnv`:

```typescript
import setEnv from './setEnv'
await setEnv() // Loads from default .env file
```

3. Create a `.env` file in your project root (or at the specified path):

```
# This is a comment
KEY1=value1
KEY2=value with = sign
BASE_URL=$HOST:$PORT
```

4. Run your Bun application as usual.

## How It Works

1. The function checks for the existence of the specified .env file (defaulting to `.env` in the current directory).
2. If the file exists, it's read line by line using Node.js streams for efficiency.
3. Each line is processed:
   - Comments (lines starting with #) and empty lines are ignored.
   - Key-value pairs are split on the first = character.
   - Values are trimmed of whitespace.
   - Variable expansion is performed, replacing $VARIABLE_NAME with the corresponding environment variable value.
   - The resulting key-value pairs are added to `process.env`.

## Advanced Usage

You can use `setEnv` with different environment configurations:

```typescript
// Load development environment
await setEnv('.env.development')

// Load production environment
await setEnv('.env.production')

// Load test environment
await setEnv('.env.test')
```

This flexibility allows you to manage multiple environment configurations easily.

## Variable Expansion

The `setEnv` function now supports variable expansion. You can reference other environment variables in your `.env` file using the `$VARIABLE_NAME` syntax. For example:

```
HOST=localhost
PORT=3000
BASE_URL=$HOST:$PORT
```

In this case, `BASE_URL` will be set to `localhost:3000`.

## Limitations

- Does not include options to prevent overwriting existing environment variables

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or encounter any problems.