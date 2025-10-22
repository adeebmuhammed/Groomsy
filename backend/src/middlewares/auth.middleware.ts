import jwt from 'jsonwebtoken';
import { Request,Response,NextFunction } from 'express';
import { MESSAGES,ROLES,STATUS_CODES } from '../utils/constants';

export interface AuthenticatedRequest extends Request {
  userId: string;
  userType: string;
}


export const authMiddleware = (allowedRoles: ROLES[])=>{
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
                type : ROLES
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
            console.error(error)
            res
            .status(STATUS_CODES.UNAUTHORIZED)
            .json({ message: MESSAGES.ERROR.INVALID_TOKEN });
            
            return;
        }
    }
}