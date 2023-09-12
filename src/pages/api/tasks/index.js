// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../server/db";
import Task from "../../../server/models/Task";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const task = await Task.create(req.body);
    res.status(201).json(task);
    console.log(req.body);
  } else if (req.method === "GET") {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
    console.log(req.query);
  } else if (req.method === "PUT") {
    try{
      // Parse the request body to get the updated task data
      const { _id, description, status, title } = req.body;
      
      const existingTask = await Task.findById(_id);

      if(!existingTask) {
        res.status(404).json({error: "Task not found" });
        console.log("Task was not found")
        return;
      }

      console.log("Updated task data: ", { description, status, title });
      //Update the task with new data
      existingTask.description = description;
      existingTask.status = status;
      existingTask.title = title;
      
      
      //Saving the updated task
      const updatedTask = await existingTask.save();
      console.log("Task updated")
      res.status(200).json(updatedTask);
    } catch (error){
      res.status(500).json({ error: "Internal server error" });
      console.error(error);
    }
  }
}
