import {body} from "express-validator"

const registerValidator = [
    body("name")
    .trim()
    .nonEmpty()
    .withMessage("Name is require")
    .isLength({min:3,max:30})
    .withMessage("Name should be 3 to 30 character"),

    body("email")
    .trim()
    .nonEmpty()
    .withMessage("Email should be required")
    .isEmail()
    .withMessage("Please Provide a valid email")
    .normalizeEmail(),

    body("password") 
    .notEmpty() 
    .withMessage("Password is required") 
    .isLength({ min: 8 }) 
    .withMessage("Password must be at least 8 characters") 
    .matches(/[A-Z]/) 
    .withMessage("Password must contain at least one uppercase letter") 
    .matches(/[a-z]/) .withMessage("Password must contain at least one lowercase letter") 
    .matches(/[0-9]/) .withMessage("Password must contain at least one number") 
    .matches(/[!@#$%^&*(),.?":{}|<>]/) 
    .withMessage("Password must contain at least one special character"),
]

const loginValidator = [
    body("email")
    .trim()
    .nonEmpty()
    .withMessage("Email must be required")
    .isEmail()
    .withMessage("Invalid Email"),

    body("password")
    .trim()
    .nonEmpty()
    .withMessage("Password Required")

]

const changePasswordValidator = [
    body("currentPassword")
    .nonEmpty()
    .withMessage("Current password must be required"),

    body("newPassword")
    .notEmpty() 
    .withMessage("Password is required") 
    .isLength({ min: 8 }) 
    .withMessage("Password must be at least 8 characters") 
    .matches(/[A-Z]/) 
    .withMessage("Password must contain at least one uppercase letter") 
    .matches(/[a-z]/) .withMessage("Password must contain at least one lowercase letter") 
    .matches(/[0-9]/) .withMessage("Password must contain at least one number") 
    .matches(/[!@#$%^&*(),.?":{}|<>]/) 
    .withMessage("Password must contain at least one special character"),
]

module.exports = {registerValidator,loginValidator,changePasswordValidator}