const UserModel = require('../models/user.model');
const Helpers = require('../Helpers/helper');
const { validationResult } = require('express-validator');


class Users {
    async userRegistration(req, res) {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(Helpers.failureMessage({ error: errors.array() }));
        }
        let body = req.body
        if (req.files.avatar) {
            let avatar = await Helpers.getFilename(req.files, "avatar");
            body.avatar = avatar;
        }
        try {
            let user = await UserModel.findOne({ email: body.email });
            if (user) return res.status(200).json(Helpers.successMessage("Email already existed"));
            let userData = await UserModel(body).save();
            let token = await Helpers.jwtToken({ id: userData._id }, process.env.USER_SECRET_KEY);
            userData.token = token;
            userData = await userData.save();
            return res.status(201).json(Helpers.successMessage(userData));
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async userLogin(req, res) {
        let errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json(Helpers.failureMessage({ error: errors.array() }));
        }
        let { email, password } = req.body;
        try {
            let user = await UserModel.findOne({ email: email });
            if (!user) return res.status(200).json(Helpers.failureMessage("Please Enter Valid Email"));
            if (user.provider == "google") return res.status(200).json(Helpers.failureMessage("Invalid Login type - Please login with Google account"));
            let valid = await Helpers.comparePasscode(password, user.password);
            if (!valid) return res.status(200).json(Helpers.failureMessage("Please Enter Valid Password"))

            let token = await Helpers.jwtToken({ id: user._id, email: user.email, }, process.env.USER_SECRET_KEY);
            user.token = token
            user = await user.save();

            return res.status(200).json({
                user: { id: user._id, email: user.email },
                message: "user Login Success",
                statusCode: 200,
                accessToken: token
            });
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async userLogout(req, res) {
        let { id } = req.user
        try {
            let userData = await UserModel.findById(id);
            if (!userData) return res.status(200).json(Helpers.failureMessage("Something went wrong"));
            userData.token = null
            userData = await userData.save();
            return res.status(200).json(Helpers.successMessage("Successfully logout"));
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async editUserData(req, res) {
        let { id } = req.user
        let body = req.body
        try {
            let userData = await UserModel.findById(id);
            if (!userData) return res.status(200).json(Helpers.failureMessage("Something went wrong"));
            if (req.files && req.files.avatar) {
                let avatar = await Helpers.getFilename(req.files, "avatar");
                body.avatar = avatar;
            }
            let userDetails = await UserModel.findOneAndUpdate({ _id: id }, body, { new: true });
            if (body.password) {
                let verifyOldPassword = await Helpers.comparePasscode(body.password, userData.password);
                if (!verifyOldPassword) return res.status(200).json(Helpers.failureMessage("Incorrect Password"));
                userData.password = body.newPassword;
                userData = await userData.save();
            }
            return res.status(200).json(Helpers.successMessage(userData));
        } catch (error) {
            console.log(error);
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async myProfile(req, res) {
        let { id } = req.user
        try {
            let userData = await UserModel.findById(id).select("-__v -token");
            if (!userData) return res.status(200).json(Helpers.failureMessage("Something went wrong"));
            return res.status(200).json(Helpers.successMessage(userData))
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async uploadImage(req, res) {
        try {
            let avatar = await Helpers.getFilename(req.files, "avatar");
            return res.status(200).json(Helpers.successMessage("https://interview-project-qmrg.onrender.com/uploads" + avatar))
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async changeProfileStatus(req, res) {
        let { id } = req.user
        try {
            let userData = await UserModel.findById(id);
            if (!userData) return res.status(200).json(Helpers.failureMessage("Something went wrong"));
            userData.profileType = userData.profileType === 1 ? 2 : 1;
            userData = await userData.save();
            if (userData.profileType == 1) {
                return res.status(200).json(Helpers.successMessage("profile status Public"));
            } else {
                return res.status(200).json(Helpers.successMessage("profile status Private"));
            }
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async getAllPublicUsers(req, res) {
        let { id } = req.user
        let query = {
            _id: { $ne: id },
            profileType: 1
        }
        try {
            let userData = await UserModel.findById(id);
            if (!userData) return res.status(200).json(Helpers.failureMessage("Something went wrong"));
            let users = await UserModel.find(query).select("-__v -token");
            return res.status(200).json(Helpers.successMessage(users));
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }

    async getAllPrivateUsers(req, res) {
        let { id } = req.user
        let query = {
            _id: { $ne: id },
            profileType: 2
        }
        try {
            if (req.user.isAdmin === false) return res.status(200).json(Helpers.failureMessage("Access denied"));
            let userData = await UserModel.findById(id);
            if (!userData) return res.status(200).json(Helpers.failureMessage("Something went wrong"));
            let users = await UserModel.find(query).select("-__v -token");
            return res.status(200).json(Helpers.successMessage(users));
        } catch (error) {
            return res.status(500).json(Helpers.failureMessage(error.message));
        }
    }
}

module.exports = new Users();