import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const studentsCollection = "students";

const studentsSchema = new mongoose.Schema({
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
  dni: Number,
  birth_date: Date,
  gender: {
    type: String,
    enum: ["M", "F"],
  },
  courses: {
    type: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "courses",
        },
      },
    ],
    default: [],
  },
});

studentsSchema.plugin(mongoosePaginate)

// Middleware para hacer el population
studentsSchema.pre("find", function(){
  this.populate("courses.course")
})

export const studentsModel = mongoose.model(studentsCollection, studentsSchema);
