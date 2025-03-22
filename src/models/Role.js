const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Add a Note"],
        unique: true,
        trim: true,
        maxLength: [50, "Role name cannot be more than 50 characters"]
    },
    permissions: {
        type: [String],
        required: true,
        default: []
    },
    description: {
        type: String,
        maxLength: [200, "Description cannot be more than 200 characters"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Role", RoleSchema);