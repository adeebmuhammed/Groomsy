"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUrl = exports.deleteObject = exports.putObject = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_credentials_1 = __importStar(require("../config/s3.credentials"));
const constants_1 = require("./constants");
const putObject = async (file, fileName) => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `${fileName}`,
            Body: file.data,
            ContentType: file.mimetype,
        };
        const command = new client_s3_1.PutObjectCommand(params);
        const data = await s3_credentials_1.default.send(command);
        if (data.$metadata.httpStatusCode !== constants_1.STATUS_CODES.OK) {
            throw new Error("profile picture upload failed");
        }
        const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        console.log(url);
        return { url, key: params.Key };
    }
    catch (error) {
        console.error(error);
        throw new Error("s3 putObject operation failed");
    }
};
exports.putObject = putObject;
const deleteObject = async (key) => {
    try {
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        };
        const command = new client_s3_1.DeleteObjectCommand(params);
        const data = await s3_credentials_1.default.send(command);
        if (data.$metadata.httpStatusCode !== 204) {
            throw new Error("profile picture deletion failed");
        }
        return "success";
    }
    catch (error) {
        console.error(error);
        throw new Error("s3 deleteObject operation failed");
    }
};
exports.deleteObject = deleteObject;
const generateUrl = async (req, res) => {
    const { fileName, fileType } = req.query;
    const { uploadUrl, key } = await (0, s3_credentials_1.generateUploadUrl)(fileName, fileType);
    res.json({ uploadUrl, key });
};
exports.generateUrl = generateUrl;
