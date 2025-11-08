"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockedMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
const user_repository_1 = require("../repositories/user.repository");
const barber_repository_1 = require("../repositories/barber.repository");
const isBlockedMiddleware = async (req, res, next) => {
    const token = req.cookies["auth-token"];
    if (!token) {
        res
            .status(constants_1.STATUS_CODES.UNAUTHORIZED)
            .json({ message: constants_1.MESSAGES.ERROR.UNAUTHORIZED });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.type === "user") {
            const userRepo = new user_repository_1.UserRepository();
            const user = await userRepo.findById(decoded.userId);
            if (!user || user.status === "blocked") {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: constants_1.MESSAGES.ERROR.BLOCKED });
                return;
            }
        }
        else if (decoded.type === "barber") {
            const barberRepo = new barber_repository_1.BarberRepository();
            const barber = await barberRepo.findById(decoded.userId);
            if (!barber || barber.status === "blocked") {
                res
                    .status(constants_1.STATUS_CODES.FORBIDDEN)
                    .json({ message: constants_1.MESSAGES.ERROR.BLOCKED });
                return;
            }
        }
        // All good — proceed to next
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res
            .status(constants_1.STATUS_CODES.UNAUTHORIZED)
            .json({ message: constants_1.MESSAGES.ERROR.UNAUTHORIZED });
        return;
    }
};
exports.isBlockedMiddleware = isBlockedMiddleware;
