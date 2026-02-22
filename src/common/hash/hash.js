

import { hash, compare } from 'bcrypt'
import { Salt } from './../../../config/index.js'


export const generateHash = async (planText) => {
    let hashedPassword = await hash(planText, Number(Salt))
    return hashedPassword

}


export const compareHash = async (planText, hash) => {
    let isMatched = await compare(planText, hash)
    return isMatched

}