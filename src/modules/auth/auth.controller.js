import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import { signup, login, getUserById, generateAccessToken, signupWithGmail, sharedUser } from './auth.service.js'
import { authentication } from "../../common/middleWare/auth.js";
import { signinSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../../common/utils/validation.js";



const router = Router()

router.post('/signup', validation(signupSchema), async (req, res) => {

    let addedUser = await signup(req.body)
    return SuccessResponse({ res, message: 'user added', status: 201, data: addedUser })

})

router.post('/signup/gmail', async (req, res) => {
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
    res.json(userData)
})

router.get('/generate-access-token', async (req, res) => {

    let { authorization } = req.headers
    let accessToken = await generateAccessToken(authorization)
    return SuccessResponse({ res, message: 'access token created', status: 200, data: accessToken })

})


router.get("/shared-user/:id", async (req, res) => {
    let userData = await sharedUser(req.params.id)

    return SuccessResponse({ res, status: 200, data: userData })

})

export default router