import { Router } from "express";
import { authentication } from "../../common/middleWare/auth.js";
import { extensions, multer_local } from "../../common/middleWare/multer.js";
import { updateProfile } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/responce/success.responce.js";
const router = Router()



router.put('/update-user', multer_local({ customPath: "profileImages", allowedType: extensions.image }).single('image'), authentication, async (req, res) => {
    let data = await updateProfile(req.userId, req.body, req.file)
    SuccessResponse({ res, message: 'user data updated', status: 200, data })
})

export default router