import { Router } from "express";
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import barberRoutes from "./barber.routes"

const router = Router()

router.use('/admin',adminRoutes)
router.use('/user',userRoutes)
router.use('/barber',barberRoutes)

export default router;