import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Status ||
  mongoose.model("Status", StatusSchema, "statuses");
