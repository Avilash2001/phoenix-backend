import { body, param } from "express-validator";
import checkToken from "../middlewares/authJWT.middleware";
import checkValidatorErrors from "../middlewares/check.middleware";

const validateAdd = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isString()
    .withMessage("Title must be a string"),
  body("content")
    .exists()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  body("authorId")
    .exists()
    .withMessage("Author id is required")
    .isInt()
    .withMessage("Author id must be an integer"),
  checkToken,
  checkValidatorErrors,
];

const validateUpdate = [
  param("id")
    .exists()
    .withMessage("Id is required")
    .isInt()
    .withMessage("Id must be an integer"),
  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long")
    .isString()
    .withMessage("Title must be a string"),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("authorId")
    .optional()
    .isInt()
    .withMessage("Author id must be an integer"),
  checkToken,
  checkValidatorErrors,
];

const validateLike = [
  param("id")
    .exists()
    .withMessage("Id is required")
    .isInt()
    .withMessage("Id must be an integer"),
  body("user_id")
    .exists()
    .withMessage("User id is required")
    .isInt()
    .withMessage("User id must be an integer"),
  checkToken,
  checkValidatorErrors,
];

const validateComment = [
  param("id")
    .exists()
    .withMessage("Id is required")
    .isInt()
    .withMessage("Id must be an integer"),
  body("user_id")
    .exists()
    .withMessage("User id is required")
    .isInt()
    .withMessage("User id must be an integer"),
  body("content")
    .exists()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  checkToken,
  checkValidatorErrors,
];

export default {
  validateAdd,
  validateUpdate,
  validateLike,
  validateComment,
};
