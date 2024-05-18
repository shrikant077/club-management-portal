const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    ename: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);