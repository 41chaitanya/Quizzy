import { connect } from "mongoose"
import { MONGO_URI } from "./env.config.js"

export const connectToDB = () => connect(MONGO_URI)