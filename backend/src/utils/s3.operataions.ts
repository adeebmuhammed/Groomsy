import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import s3Client from "../config/s3.credentials";
import { STATUS_CODES } from "./constants";

export const putObject = async (file: any, fileName: string) => {
  try {
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${fileName}`,
      Body: file.data,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);

    const data = await s3Client.send(command);
    if (data.$metadata.httpStatusCode !== STATUS_CODES.OK) {
      throw new Error("profile picture upload failed");
    }

    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    console.log(url);
    
    return { url, key: params.Key };
  } catch (error) {
    console.error(error);
    throw new Error("s3 putObject operation failed");
  }
};

export const deleteObject = async (key: string) => {
  try {
    const params: DeleteObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    }

    const command = new DeleteObjectCommand(params)
    const data = await s3Client.send(command)

    if (data.$metadata.httpStatusCode !== 204) {
      throw new Error("profile picture deletion failed");
    }

    return "success";
  } catch (error) {
    console.error(error);
    throw new Error("s3 deleteObject operation failed");
  }
}