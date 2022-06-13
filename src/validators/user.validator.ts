import { body } from "express-validator";
import checkToken from "../middlewares/authJWT.middleware";

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
    .exists()
    .withMessage("Profile pic is required")
    .isURL()
    .withMessage("Profile pic must be a valid URL"),
  body("bio").exists().withMessage("Bio is required").isLength({ min: 3 }),
  body("coverPic")
    .exists()
    .withMessage("Cover pic is required")
    .isURL()
    .withMessage("Cover pic must be a valid URL"),
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
];

const validateRefresh = [
  body("refreshToken").exists().withMessage("Refresh token is required"),
  checkToken,
];

export default {
  validateRegister,
  validateLogin,
  validateUpdate,
  validateRefresh,
};
