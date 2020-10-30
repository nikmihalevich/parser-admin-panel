const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String,
    },
    password: {
        type: String
    }
});

const User = mongoose.model("users", userSchema);

module.exports = User;
