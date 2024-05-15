const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const Helpers = require('../Helpers/helper');
const ObjectId = require('mongoose').Types.ObjectId;

class TokenVerification {
    async userVerifyToken(req, res, next) {
        try {
            if (req.headers && req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                let verify = jwt.verify(token, process.env.USER_SECRET_KEY);
                if (!verify) {
                    return res.status(401).json(Helpers.failureMessage("Access denied"));
                }
                let id = verify.id;
                if (ObjectId.isValid(id)) {
                    let userData = await UserModel.findById(verify.id);
                    if (!userData || (userData.token && token != userData.token)) {
                        return res.status(200).json({
                            message: "Failed",
                            statusCode: 403,
                            data: "Invalid Token"
                        });
                    }
                    req.user = userData;
                    return next();
                }
            }
            return res.status(401).json(Helpers.failureMessage("Access denied"));
        } catch (error) {
            return res.status(400).json(Helpers.failureMessage(error.message));
        }
    }
}

module.exports = new TokenVerification();