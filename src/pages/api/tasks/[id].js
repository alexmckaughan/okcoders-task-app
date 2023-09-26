 import dbConnect from "../../../server/db";
 import Task from "../../../server/models/Task";
 import { getAuth } from "@clerk/nextjs/server";

 export default async function taskById(req, res) {
  const { userId } = getAuth(req);
   //getting the id for the backend
   const { id } = req.query
   //query the database
   await dbConnect();
   //find the task by the id and put it into a variable
   const taskData = await Task.findById(id);
   //if there isn't a task to return a 404 and message will show
   if (!taskData) {
     res.status(404).json({ message: "Task was not found" });
   }
   res.status(200).json(taskData);
 }
