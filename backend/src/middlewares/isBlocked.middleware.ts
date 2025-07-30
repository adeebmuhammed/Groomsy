import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { UserRepository } from "../repositories/user.repository";
import { BarberRepository } from "../repositories/barber.repository";

export const isBlockedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["auth-token"];

  if (!token) {
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      type: string;
    };

    if (decoded.type === "user") {
      const userRepo = new UserRepository();

      const user = await userRepo.findById(decoded.userId);
      if (!user || user.status === "blocked") {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.BLOCKED });
        return;
      }
    } else if (decoded.type === "barber") {
      const barberRepo = new BarberRepository();

      const barber = await barberRepo.findById(decoded.userId);
      if (!barber || barber.status === "blocked") {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.BLOCKED });
        return;
      }
    }

    // All good — proceed to next
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
    return;
  }
};
