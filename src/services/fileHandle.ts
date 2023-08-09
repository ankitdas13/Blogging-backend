import multer from "multer"
import path from "path"
import express from 'express'
import { SignedUrlPayload } from "../interfaces";
import { s3Client } from "../clients/aws";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const router = express.Router()


class FileHandleService {

    public static MulterStorage() {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.resolve(__dirname, "..", "../public", "profileImage"))
            },
            filename: function (req, file, cb) {
                const extension = file.originalname.split(".")[1]
                //@ts-ignore
                cb(null, `profile_${req.user.id}` + '.' + extension)
            }
        })

        return multer({ storage: storage })
    }

    public static getSignedUrlForPost(payload: SignedUrlPayload) {

        const { filname, contentType, userId } = payload
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET as string,
            Key: `uploads/${userId}/${filname}`,
            ContentType: contentType
        })

        const url = getSignedUrl(s3Client, command)
        return url;
    }

    public static getPostFromS3(payload: any) {
        const { filname, userId } = payload
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET as string,
            Key: `uploads/${userId}/${filname}`,
        })

        const url = getSignedUrl(s3Client, command, { expiresIn: 1000 })
        return url;
    }
}

export default FileHandleService