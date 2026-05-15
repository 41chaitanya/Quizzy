import "dotenv/config"

export const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env

const checkVariables = {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
}

Object.entries(checkVariables).forEach(([key, value]) => {
  if (!value) {
    console.log(`Missing Environment Variable: ${key}`)
    throw new Error("Missing Environment Variable : ", key)
  }
})