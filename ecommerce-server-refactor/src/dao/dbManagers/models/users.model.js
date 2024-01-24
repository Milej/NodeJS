import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    default: "",
  },
  last_name: {
    type: String,
    required: true,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: "",
  },
  carts: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  role: {
    type: String,
    default: "user",
  },
});

usersSchema.plugin(paginate);

export const userModel = mongoose.model(usersCollection, usersSchema);
