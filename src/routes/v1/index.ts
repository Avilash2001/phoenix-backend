import { Router } from "express";
import userRoutes from "../v1/user.routes";
import postRoutes from "../v1/post.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/post", postRoutes);

export default router;
