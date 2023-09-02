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
  }
}
