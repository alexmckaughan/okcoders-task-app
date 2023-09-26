import mongoose from "mongoose";
import dbConnect from "../../../server/db";
import Status from "../../../server/models/Status";

export default async function handler(req, res) {
  console.log("API request received");
  await dbConnect();

  if (req.method === "POST") {
    const status = await Status.create(req.body);
    res.status(201).json(status);
    console.log(req.body);
  } else if (req.method === "GET") {
    const { projectId } = req.query;

    if (!projectId) {
      return res
        .status(400)
        .json({ message: "projectId query parameter is required" });
    }

    const isValidObjectId = mongoose.Types.ObjectId.isValid(projectId);
    if (!isValidObjectId) {
      return res.status(400).json({ message: "Invalid projectId format" });
    }

    console.log(`Searching for statuses with projectId: ${projectId}`);
    const ObjectId = mongoose.Types.ObjectId;
    const statuses = await Status.find({
      project: new ObjectId(projectId),
    });
    console.log(`Found statuses:`, statuses);
    res.status(200).json(statuses);
  }
}
// else if (req.method === "PUT")
// In what case would we need to handle a put request for the projects api?

// else if (req.method === "DELETE")
// Should this delete all task associated with the corresponding project?
