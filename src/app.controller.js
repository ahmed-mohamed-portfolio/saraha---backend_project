
import express from 'express'
import { databaseConnection } from './database/index.js'
import { PORT } from '../config/index.js'
import { globalErrorHandler } from './common/utils/responce/index.js'
import authRouter from '../src/modules/auth/auth.controller.js'
import messageRouter from '../src/modules/message/message.controller.js'

import cors from 'cors'

export const bootstrap = async () => {

    const app = express()
    app.use(express.json())
    app.use(cors())
    app.use(express.urlencoded({ extended: true }));
    app.use('/upload', express.static("upload"))

    app.use('/auth', authRouter)
    app.use('/message', messageRouter)
    await databaseConnection()

    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))

    app.use(globalErrorHandler)

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    })

}