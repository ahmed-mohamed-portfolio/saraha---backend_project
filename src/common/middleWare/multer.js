import multer from 'multer'
import fs from 'node:fs'




export const extensions = {
    image: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    video: ["video/mp4", "video/mkv", "video/webm", "video/ogg"],
    pdf: ["application/pdf"],
    excel: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    word: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};




export let multer_local = ({ customPath, allowedType } = { customPath: "general" }) => {


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let filePath = `upload/${customPath}`
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true })
            }
            cb(null, filePath)
        },



        filename: function (req, file, cb) {

            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    })




    let fileFilter = function (req, file, cb) {

        if (allowedType.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb("wrong type", false)
        }

    }



    return multer({
        storage, fileFilter, limits: {
            fileSize: 5 * 1024 * 1024
        }
    })
}
