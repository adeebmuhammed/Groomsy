import fileUpload from "express-fileupload";

declare module "express-serve-static-core" {
  interface Request {
    files?: fileUpload.FileArray | null;
  }
}