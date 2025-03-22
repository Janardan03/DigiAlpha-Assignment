const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "Please add a first Name"],
        trim: true,
        maxLength: [50, "First name cannot be more than 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Please add a last Name"],
        trim: true,
        maxLength: [50, "Last name cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"]
    },
    phone: {
        type: String,
        required: [true, "Please add a phone number"],
        maxlength: [20, "Phone number cannot be longer than 20 characters"]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: 6,
        select: false
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre("save", async function(next) {

    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function() {

    return jwt.sign({id: this._id}, config.jwtSecret, {expiresIn: config.jwtExpire});
}

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("user", UserSchema);