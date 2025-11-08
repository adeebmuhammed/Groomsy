"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_routes_1 = __importDefault(require("./admin.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const barber_routes_1 = __importDefault(require("./barber.routes"));
const refresh_token_controller_1 = require("../controllers/refresh.token.controller");
const s3_operataions_1 = require("../utils/s3.operataions");
const router = (0, express_1.Router)();
router.use('/admin', admin_routes_1.default);
router.use('/user', user_routes_1.default);
router.use('/barber', barber_routes_1.default);
router.get("/generate-upload-url", s3_operataions_1.generateUrl);
router.post("/refresh-token", refresh_token_controller_1.refreshTokenController.refreshTokenController);
exports.default = router;
