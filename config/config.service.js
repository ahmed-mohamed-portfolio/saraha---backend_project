import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.resolve('./config/.env')})

let DB_URL    = process.env.DATABASE_URL
let PORT      = process.env.SERVER_PORT
let PROJ_MOOD = process.env.MOOD

export {
    DB_URL,
    PORT,
    PROJ_MOOD
}