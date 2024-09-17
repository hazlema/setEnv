import setEnv from "./setEnv"
await setEnv()

console.log("Set a plain text environment variable:", process.env.test)
console.log("Set a environment variable that contains a variable:", process.env.test2)
