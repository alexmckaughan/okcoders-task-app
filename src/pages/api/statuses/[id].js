import dbConnect from "../../../server/db";
import Status from "../../../server/models/Status";
export default async function statusById(req, res) {
  //getting the id for the backend
  const { id } = req.query;
  //query the database
  await dbConnect();
  //find the status by the id and put it into a variable
  const statusData = await Status.findById(id);
  //if there isn't a status to return a 404 and message will show
  if (!statusData) {
    res.status(404).json({ message: "Status was not found" });
  }
  res.status(200).json(statusData);
}
