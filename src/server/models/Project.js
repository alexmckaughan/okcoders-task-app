import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    starts: { type: Date, required: false },
    ends: { type: Date, required: false },
    editor: {type: Array, required: false},
    createdBy: {type: String, required: false},
    modifiedBy: {type: String, required: false},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema, "projects");
