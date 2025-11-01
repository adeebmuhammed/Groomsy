import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId : process.env.AWS_ACCESS_KEY || "",
        secretAccessKey : process.env.AWS_SECRET_KEY || ""
    }
})

export const generateUploadUrl = async (fileName: string, fileType: string) => {
  const key = `images/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });

  return { uploadUrl: url, key };
};

export default s3Client;