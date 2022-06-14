import { body, param } from "express-validator";
import checkToken from "../middlewares/authJWT.middleware";
import checkValidatorErrors from "../middlewares/check.middleware";

const validateRegister = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("name").exists().withMessage("Name is required").isLength({ min: 3 }),
  body("profilePic")
    .optional()
    .isURL()
    .withMessage("Profile pic must be a valid URL"),
  body("bio").optional().isLength({ min: 3 }),
  body("coverPic")
    .optional()
    .isURL()
    .withMessage("Cover pic must be a valid URL"),
  checkValidatorErrors,
];

const validateLogin = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  checkValidatorErrors,
];

const validateUpdate = [
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("name").optional().isLength({ min: 3 }),
  body("profilePic")
    .optional()
    .isURL()
    .withMessage("Profile pic must be a valid URL"),
  body("bio").optional().isLength({ min: 3 }),
  body("coverPic")
    .optional()
    .isURL()
    .withMessage("Cover pic must be a valid URL"),
  checkToken,
  checkValidatorErrors,
];

const validateRefresh = [
  body("refreshToken").exists().withMessage("Refresh token is required"),
  checkToken,
  checkValidatorErrors,
];

const validateFollow = [
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

export default {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateRefresh,
  validateFollow,
};
