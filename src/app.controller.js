
import express from 'express'
import { databaseConnection } from './database/index.js'
import { PORT } from '../config/index.js'
import { globalErrorHandler } from './common/utils/responce/index.js'
import authRouter from '../src/modules/auth/auth.controller.js'
import cors from 'cors'

export const bootstrap = async () => {

    const app = express()
    app.use(express.json())
    app.use(cors())

    app.use('/auth', authRouter)

    await databaseConnection()


    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))

    app.use(globalErrorHandler)

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);

    })

}