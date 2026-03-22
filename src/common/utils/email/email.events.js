
import { EventEmitter } from "events"
import { set } from '../../../common/services/index.js'
import { sendEmail } from "./sendEmail.js"
import { BadRequestException } from "../responce/error.responce.js"
import { generateHash } from "../../hash/hash.js"
import { verifyEmailTemplate } from "./verifyEmailTemplate.js"

export let event = new EventEmitter()


//? send gmail verify code
event.on("verifyEmail", async (data) => {

    let { userId, email } = data

    let code = Math.floor(Math.random() * 10000).toString().padStart(4, 0)
    try {

        await set({
            key: `OTP::${userId}`,
            value: await generateHash(code),
            ttl: 5 * 60
        })

        await sendEmail({
            to: email,
            subject: "verify your email",
            html: verifyEmailTemplate(code)
        })

    } catch (error) {
        return BadRequestException({ message: "problem in send verification code", extra: error })
    }


})
