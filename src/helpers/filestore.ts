import path from "path";
import { promises as fs, existsSync } from "fs";
import { db } from "../database";
import { File } from "../models/file";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

export const storagePath = process.env.CDN_PATH || path.join(__dirname, "../../cdn");

const storage = multer.diskStorage({
    destination: storagePath,
});

// Multiple middleware for uploading images
export const uploadImage = (field: string) => [
    multer({
        storage: storage, fileFilter: (req, file, cb) => {
            // Only allow images
            if (!file.mimetype.startsWith('image/')) {
                req.res!.status(400).render('error/error', {
                    error: 'Only images are allowed'
                });
                return cb(null, false);
            }

            cb(null, true);
        }
    }).single(field),
    async (req: Request, res: Response, next: NextFunction) => {
        // Create new file model object
        const newFile = new File();

        newFile.name = req.file!.originalname;
        newFile.identifier = req.file!.filename
        newFile.size = req.file!.size;

        // Save to database
        res.locals.file = await db.getRepository(File).save(newFile);

        next()
    }
]

export const deleteFile = async (file: File) => {
    const filePath = path.join(storagePath, file.identifier);

    // Delete file from disk
    if (existsSync(filePath)) {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.error(err);
        }
    }

    // Delete file from database
    await db.getRepository(File).delete(file);
}
