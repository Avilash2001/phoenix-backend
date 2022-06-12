import { Router } from "express";
import postController from "../../controllers/post.controller";

const router = Router();

router.post("/", postController.add);
router.get("/", postController.get);
router.patch("/:id", postController.update);
router.delete("/:id", postController.remove);
router.post("/:id/like", postController.like);
router.post("/:id/comment", postController.comment);

export default router;
