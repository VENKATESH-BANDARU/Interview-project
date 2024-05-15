const { check } = require("express-validator");
const UserModel = require("../models/user.model");

class userValidation {
    UserAddValidation() {
        const fields = [
            check('fullName').trim().isString().notEmpty().withMessage("Please enter fullname"),
            check('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).notEmpty().withMessage("Provide valid email"),
            check('phone').trim().isString().notEmpty().withMessage("please enter phone number"),
            check('gender').trim().isNumeric().notEmpty().withMessage("please mention gender"),
            check('password').exists().trim().isString().isStrongPassword({
                minLength: 8,
                minUppercase: 1,
                minLowercase: 1,
                minSymbols: 1,
                minNumbers: 1
            }).withMessage("Please Enter Atleast 8 Charecters With 1 Uppercasse, 1 Lowercase, 1 Symbol and 1 Number").notEmpty(),
            check('bio').trim().isString().notEmpty().withMessage("please enter bio"),
            check('address').trim().isString().notEmpty().withMessage("please enter address"),
        ]
        return fields
    }

    UserLoginValidation() {
        const loginFields = [
            check('email').trim().isEmail().normalizeEmail({ gmail_remove_dots: false }).notEmpty().withMessage("Provide valid email"),
            check('password').exists().trim().isString().isStrongPassword({
                minLength: 8,
                minUppercase: 1,
                minLowercase: 1,
                minSymbols: 1,
                minNumbers: 1
            }).withMessage("Please Enter Atleast 8 Charecters With 1 Uppercasse, 1 Lowercase, 1 Symbol and 1 Number").notEmpty(),
        ]
        return loginFields
    }
}

module.exports = new userValidation();