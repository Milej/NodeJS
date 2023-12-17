import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  rol: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

const User = mongoose.model(usersCollection, usersSchema);

export default User;
