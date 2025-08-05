import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import { MESSAGES,STATUS_CODES } from '../utils/constants';
import Users from '../models/user.model';

export interface AuthenticatedRequest extends Request {
  userId: string;
  userType: string;
}


export const authMiddleware = (allowedRoles: string[])=>{
    return async (req : Request, res : Response, next : NextFunction)=>{
        const token = req.cookies["auth-token"]
        
        if (!token) {
            res
            .status(STATUS_CODES.UNAUTHORIZED)
            .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
            return;
        }

        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET as string) as {
                userId : string,
                type : string
            }

            if (!allowedRoles.includes(decoded.type)) {
                res
                .status(STATUS_CODES.FORBIDDEN)
                .json({ message: MESSAGES.ERROR.FORBIDDEN });
                
                return;
            }

            (req as AuthenticatedRequest).userId = decoded.userId;
            (req as AuthenticatedRequest).userType = decoded.type;

            next()
        } catch (error) {
            res
            .status(STATUS_CODES.UNAUTHORIZED)
            .json({ message: MESSAGES.ERROR.INVALID_TOKEN });
            
            return;
        }
    }
}