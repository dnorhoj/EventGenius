import { RequestHandler } from "express";
import { db } from "../database";
import { File } from "../models/file";
import { storagePath } from "../helpers/filestore";
import path from "path";

export const get: RequestHandler = async (req, res) => {
    const file = await db.getRepository(File).findOne({
        where: {
            identifier: req.params.id
        }
    });

    if (!file) {
        return res.status(404).render('error/404');
    }

    const filePath = path.join(storagePath, file.identifier);

    res.download(filePath, file.name);
}
