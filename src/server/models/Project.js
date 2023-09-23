import mongoose, { model } from "mongoose";
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  starts: { type: Date, required: true },
  ends: { type: Date, required: true },
  statuses: { type: String, required: true },
});
export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema, "projects");
