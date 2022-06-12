import { Router } from "express";
import userController from "../../controllers/user.controller";

const router = Router();

router.post("/", userController.add);
router.get("/", userController.get);
router.patch("/:id", userController.update);
router.delete("/:id", userController.remove);

export default router;
