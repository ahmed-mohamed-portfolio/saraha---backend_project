import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/index.js";
import {signup,login, getUserById} from './auth.service.js'
import { auth } from "../../common/middleWare/auth.js";

const router = Router()


router.post('/signup', async (req, res) => {
    let addedUser = await signup(req.body)
    return SuccessResponse({res,message :'user added',status:201,data:addedUser})

})


router.post('/login', async (req, res) => {
        let host = `${req.protocol}://${req.host}`;

    let loginUser = await login(req.body,host)
    return SuccessResponse({res,message :'user login successfully ',status:200,data:loginUser})

})


router.get('/get-user-by-id',auth,async (req,res)=>{
    
    let userData = await getUserById(req.userId)
    res.json(userData)
})

export default router