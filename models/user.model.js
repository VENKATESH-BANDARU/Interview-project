const mongoose = require("mongoose");
const { Profile_Type: { PUBLIC, PRIVATE }, Gender: { MALE, FEMALE, OTHERS } } = require('../utils/constants');
const Schema = mongoose.Schema;
const Helpers = require("../Helpers/helper");

const UserModel = new Schema({
    fullName: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    gender: {
        type: Number,
        enum: [MALE, FEMALE, OTHERS], // 1 => Male, 2 => Female, 3 => Others
        default: null
    },
    address: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profileType: {
        type: Number,
        enum: [PUBLIC, PRIVATE], // 1 => Public, 2 => Private
        default: PUBLIC
    },
    token: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        default: "local"
    }
}, {
    timestamps: true
});

UserModel.pre("save", async function (next) {
    const user = this;
    if (user.password && (user.isModified("password") || user.isNew)) {
        let hash = await Helpers.hashPasscode(user.password);
        user.password = hash;
    }
    next();
});

module.exports = mongoose.model("user", UserModel);