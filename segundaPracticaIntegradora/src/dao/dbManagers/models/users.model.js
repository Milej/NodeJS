import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
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
    deafult: "user",
  },
});

usersSchema.plugin(mongoosePaginate);

export const usersModel = mongoose.model(usersCollection, usersSchema);
