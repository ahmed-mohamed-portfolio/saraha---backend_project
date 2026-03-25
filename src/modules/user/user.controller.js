import { Router } from "express";
import { authentication } from "../../common/middleWare/auth.js";
import { extensions, multer_local } from "../../common/middleWare/multer.js";
import { deleteProfile, updateProfile } from "./user.service.js";
import { SuccessResponse } from "../../common/utils/responce/success.responce.js";
import { validation } from "../../common/utils/validation.js";
import { updateSchema } from "./user.validation.js";
const router = Router({ caseSensitive: true, strict: true })



router.put('/update-user', multer_local({ customPath: "profileImages", allowedType: extensions.image }).single('image'), authentication, validation(updateSchema), async (req, res) => {

    const body = JSON.parse(req.body.registerForm)

    let data = await updateProfile(req.userId, body, req.file)
    SuccessResponse({ res, message: 'user data updated', status: 200, data })
})



router.delete('/delete-profile', authentication, async (req, res) => {

    let data = await deleteProfile(req.userId)
    SuccessResponse({ res, message: "user deleted", status: 200, data })
})


export default router