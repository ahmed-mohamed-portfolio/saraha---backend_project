import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import {signup,login} from './auth.service.js'

const router = Router()


router.post('/signup', async (req, res) => {
    let addedUser = await signup(req.body)
    return SuccessResponse({res,message :'user added',status:201,data:addedUser})

})


router.post('/login', async (req, res) => {
    let loginUser = await login(req.body)
    return SuccessResponse({res,message :'user login successfully ',status:200,data:loginUser})

})

export default router