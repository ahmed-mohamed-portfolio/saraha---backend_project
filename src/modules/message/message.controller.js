import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/success.responce.js";
import { getAllMessages, sendMessage } from "./message.service.js";
import { authentication } from "../../common/middleWare/auth.js";

const router = Router()

router.post('/send-message/:id', async (req, res) => {

    let data = await sendMessage(req.body, req.params.id)
    SuccessResponse({ res, message: "message sent successfully", status: 200, data })
})


router.get('/get-all-messages', authentication, async (req, res) => {

    let data = await getAllMessages(req.userId)
    SuccessResponse({ res, message: "messages get successfully", status: 200, data })
})
export default router