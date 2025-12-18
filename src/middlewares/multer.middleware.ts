import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from "path";

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req: Request, file: Express.Multer.File,cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extName = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if(extName && mimeType) {
        cb(null, true)
    } else {
        cb(new Error("Only (jpeg,jpg,png,webp) files are allowed."))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})