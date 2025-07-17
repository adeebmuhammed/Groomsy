import { Router } from "express";
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import barberRoutes from "./barber.routes"

import { refreshTokenController } from "../controllers/refresh.token.controller";

const router = Router()

router.use('/admin',adminRoutes)
router.use('/user',userRoutes)
router.use('/barber',barberRoutes)

router.post("/refresh-token", refreshTokenController)

export default router;