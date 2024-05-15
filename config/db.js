const mongoose = require("mongoose");
require("dotenv").config().parsed

mongoose.connect(process.env.MONGODB_URL).then(() => console.log("DB connected"))
    .catch((err) => console.log(err.message));

module.exports = mongoose