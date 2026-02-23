import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.resolve('./config/.env')})

let DB_URL    = process.env.DATABASE_URL
let PORT      = process.env.SERVER_PORT
let PROJ_MOOD = process.env.MOOD
let Salt      = process.env.SALT
let jwt_key   = process.env.JWT_KEY 
let jwt_admin_signature = process.env.JWT_ADMIN_SIGNATURE 
let jwt_user_signature  = process.env.JWT_USER_SIGNATURE 


export {
    DB_URL,
    PORT,
    PROJ_MOOD,
    Salt,
    jwt_key ,
    jwt_admin_signature,
    jwt_user_signature
}