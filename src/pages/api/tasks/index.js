// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../server/db";
import Task from "../../../server/models/Task";
import mongoose from "mongoose";
import { getAuth } from "@clerk/nextjs/server"

export default async function handler(req, res) {
  const { userId } = getAuth(req);
  console.log("API request received");
  await dbConnect();

  if (req.method === "POST") {
    const { projectId } = req.query;
    const task = await Task.create(req.body);
    res.status(201).json(task);
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

    console.log(`Searching for tasks with projectId: ${projectId}`);
    const ObjectId = mongoose.Types.ObjectId;
    const tasks = await Task.find({
      project: new ObjectId(projectId),
    });
    console.log(`Found tasks:`, tasks);
    res.status(200).json(tasks);
  } else if (req.method === "PUT") {
    try {
      // Parse the request body to get the updated task data
      const { _id, description, status, title, due } = req.body;

      const existingTask = await Task.findById(_id);

      if (!existingTask) {
        res.status(404).json({ error: "Task not found" });
        console.log("Task was not found");
        return;
      }

      console.log("Updated task data: ", { description, status, title, due });
      //Update the task with new data
      existingTask.description = description;
      existingTask.status = status;
      existingTask.title = title;
      existingTask.due = due;

      //Saving the updated task
      const updatedTask = await existingTask.save();
      console.log("Task updated");
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.error(error);
    }
  } else if (req.method === "DELETE") {
    try {
      const taskId = req.query.id;
      console.log(taskId);
      const taskTitle = req.query.title;
      console.log(taskTitle);

      if (!taskId) {
        res.status(400).json({ error: "Missing task id" });
        return;
      }

      const deletedTask = await Task.findByIdAndDelete(taskId);

      if (!deletedTask) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.status(200).json({ message: `"${taskTitle}" deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.error(error);
    }
  }
}
