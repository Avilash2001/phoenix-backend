import { Router } from "express";
import postController from "../../controllers/post.controller";
import checkToken from "../../middlewares/authJWT.middleware";
import postValidator from "../../validators/post.validator";

const router = Router();

router.post("/", postValidator.validateAdd, postController.add);
router.get("/", checkToken, postController.get);
router.patch("/:id", postValidator.validateUpdate, postController.update);
router.delete("/:id", checkToken, postController.remove);
router.post("/:id/like", postValidator.validateLike, postController.like);
router.post(
  "/:id/comment",
  postValidator.validateComment,
  postController.comment
);

export default router;
