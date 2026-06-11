import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  requiredSkills: [
    {
      type: String,
      trim: true,
    },
  ],

  experienceRequired: {
    type: String,
    default: "",
  },

  location: {
    type: String,
    default: "",
  },

  employmentType: {
    type: String,
    default: "",
  },

  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
},
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);
