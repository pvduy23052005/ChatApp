import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  statusOnline: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
})

const User = mongoose.model("User", userSchema, "users");

export default User; 
