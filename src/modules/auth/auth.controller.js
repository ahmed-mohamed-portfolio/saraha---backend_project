import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import { signup, login, getUserById, generateAccessToken, signupWithGmail, sharedUser, logOutFromAllDevices, logOut, verifyEmail, sendEmail, forgetPassword, verifyCode, editUserPassword } from './auth.service.js'
import { authentication } from "../../common/middleWare/auth.js";
import { newPasswordSchema, signinSchema, signupSchema, verifySchema } from "./auth.validation.js";
import { validation } from "../../common/utils/validation.js";
import { extensions, multer_local } from "../../common/middleWare/multer.js"


const router = Router()


router.post('/signup', multer_local({ customPath: "profileImages", allowedType: extensions.image }).single("image"), validation(signupSchema), async (req, res) => {

    const body = JSON.parse(req.body.registerForm)

    let addedUser = await signup(body, req.file)
    return SuccessResponse({ res, message: 'user added', status: 201, data: addedUser })

})

router.post("/verify", validation(verifySchema), async (req, res) => {

    let data = await verifyEmail(req.body)
    return SuccessResponse({ res, message: 'email verified', status: 200, data })

})

router.post('/signup/gmail', async (req, res) => {

    //? i used this email ==> ahmed.mohamed.connect@gmail.com
    let host = `${req.protocol}://${req.host}`;

    let { message, status, data } = await signupWithGmail(req.body.idToken, host)
    return SuccessResponse({ res, message, status, data })

})

router.post('/login', validation(signinSchema), async (req, res) => {
    let host = `${req.protocol}://${req.host}`;

    let loginUser = await login(req.body, host)
    return SuccessResponse({ res, message: 'user login successfully', status: 200, data: loginUser })

})

router.get('/get-user-by-id', authentication, async (req, res) => {

    let userData = await getUserById(req.userId)
    return SuccessResponse({ res, message: 'user data got successfully', status: 200, data: userData })

})

router.get('/generate-access-token', async (req, res) => {

    let { authorization } = req.headers


    let accessToken = await generateAccessToken(authorization)
    return SuccessResponse({ res, message: 'access token created', status: 200, data: accessToken })

})

router.get("/shared-user/:profileName", async (req, res) => {

    let userData = await sharedUser(req.params.profileName)

    return SuccessResponse({ res, status: 200, data: userData })

})

router.patch("/logout-from-all-devices", authentication, async (req, res) => {

    await logOutFromAllDevices(req.userId)
    return SuccessResponse({ res, message: 'logged out from all devices successfully', status: 200 })

})

router.post("/logout", authentication, async (req, res) => {

    await logOut(req.userId, req.jti)
    return SuccessResponse({ res, message: 'logged out successfully', status: 200 })

})

router.post('/sendVerificationEmail', async (req, res) => {

    await sendEmail(req.body)
    return SuccessResponse({ res, message: 'email sent', status: 200 })

})

router.post("/forget-password", async (req, res) => {

    let data = await forgetPassword(req.body)

    return SuccessResponse({ res, message: 'email sent', status: 200, data })

})

router.post("/verify-code", async (req, res) => {

    await verifyCode(req.body)

    return SuccessResponse({ res, message: 'valid otp', status: 200 })

})

router.put("/edit-user-password", validation(newPasswordSchema), async (req, res) => {

    let data = await editUserPassword(req.body)

    return SuccessResponse({ res, message: 'password changed', status: 200, data })

})

export default router