import jwt from "jsonwebtoken";
import { Response,Request } from "express";
import { generateAccessToken } from "../utils/jwt.generator";

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies["refresh-token"];
  
  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token missing" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      userId: string;
      type: string;
    };

    const newAccessToken = generateAccessToken({ userId: decoded.userId, type: decoded.type });

    res.cookie("auth-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
