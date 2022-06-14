import { Router } from "express";
import userController from "../../controllers/user.controller";
import checkToken from "../../middlewares/authJWT.middleware";
import userValidator from "../../validators/user.validator";

const router = Router();

router.post("/", userValidator.validateRegister, userController.add);
router.post("/login", userValidator.validateLogin, userController.login);
router.get("/", checkToken, userController.get);
router.patch("/:id", userValidator.validateUpdate, userController.update);
router.delete("/:id", checkToken, userController.remove);
router.post("/logout", userValidator.validateRefresh, userController.logout);
router.post("/refresh", userValidator.validateRefresh, userController.refresh);
router.post("/:id/follow", userValidator.validateFollow, userController.follow);

export default router;
