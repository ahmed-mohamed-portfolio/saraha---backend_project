import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve('./config/.env') })

let DB_URL = process.env.DATABASE_URL
let PORT = process.env.SERVER_PORT
let PROJ_MOOD = process.env.MOOD
let Salt = process.env.SALT
let jwt_key = process.env.JWT_KEY
let jwt_admin_signature = process.env.JWT_ADMIN_SIGNATURE
let jwt_user_signature = process.env.JWT_USER_SIGNATURE
let jwt_admin_refresh_signature = process.env.JWT_ADMIN_REFRESH_SIGNATURE
let jwt_user_refresh_signature = process.env.JWT_USER_REFRESH_SIGNATURE
let gmail_client_id = process.env.GMAIL_CLIENT_ID
let base_url = process.env.BASE_URL
let redis_uri = process.env.REDIS_URI
export {
    DB_URL,
    PORT,
    PROJ_MOOD,
    base_url,
    Salt,
    jwt_key,
    jwt_admin_signature,
    jwt_user_signature,
    jwt_admin_refresh_signature,
    jwt_user_refresh_signature,
    gmail_client_id,
    redis_uri
}