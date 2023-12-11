import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    role: {
      type: String,
      enum: ["PARTICIPANT", "ADMIN", "HOST"],
      default: "PARTICIPANT" 
    },
    token: String,
    tokenExpiry: Date,
  },
  { collection: "users" });

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;