import { Router } from "express";
import { SuccessResponse } from "../../common/utils/responce/success.responce.js";
import { sendMessage } from "./message.service.js";

const router = Router()

router.post('/send-message/:id', async (req, res) => {

    let data = await sendMessage(req.body, req.params.id)
    SuccessResponse({ res, message: "message sent successfully", status: 200, data })
})



export default router