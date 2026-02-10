
import express from 'express'
import { databaseConnection } from './database/connection.js'
import { PORT } from '../config/config.service.js'


export const bootstrap = async () => {

    const app = express()
    app.use(express.json())


    await databaseConnection()

    app.use((error, req, res, next) => {
        res.json({ message: "something went wrong", error: error.message })
    })

    app.use('{*dummy}', (req, res) => res.status(404).json('invalid route'))

    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);

    })

}