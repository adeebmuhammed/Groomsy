"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_generator_1 = require("../utils/jwt.generator");
const constants_1 = require("../utils/constants");
class RefreshTokenController {
    constructor() {
        this.refreshTokenController = async (req, res) => {
            const refreshToken = req.cookies["refresh-token"];
            if (!refreshToken) {
                res.status(401).json({ message: "Refresh token missing" });
                return;
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const newAccessToken = (0, jwt_generator_1.generateAccessToken)({
                    userId: decoded.userId,
                    type: decoded.type,
                });
                res.cookie("auth-token", newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000, // 1 hour
                });
                res.status(constants_1.STATUS_CODES.OK).json({ message: "Access token refreshed" });
            }
            catch (error) {
                console.error(error);
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: "Invalid refresh token" });
            }
        };
    }
}
exports.refreshTokenController = new RefreshTokenController();
