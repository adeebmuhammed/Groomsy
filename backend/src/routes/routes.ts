import { Router } from "express";
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import barberRoutes from "./barber.routes"

import { refreshTokenController } from "../controllers/refresh.token.controller";
import { generateUrl } from "../utils/s3.operataions";

const router = Router()

router.use('/admin',adminRoutes)
router.use('/user',userRoutes)
router.use('/barber',barberRoutes)

router.get("/generate-upload-url", generateUrl);
router.post("/refresh-token", refreshTokenController.refreshTokenController)

export default router;