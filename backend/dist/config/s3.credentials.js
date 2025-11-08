"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_KEY || ""
    }
});
const generateUploadUrl = async (fileName, fileType) => {
    const key = `images/${fileName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        ContentType: fileType,
    });
    const url = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 60 * 5 });
    return { uploadUrl: url, key };
};
exports.generateUploadUrl = generateUploadUrl;
exports.default = s3Client;
