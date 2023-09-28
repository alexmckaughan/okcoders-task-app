import dbConnect from "../../../server/db";
import Project from "../../../server/models/Project";


export default async function projectById(req, res) {
    const { id } = req.query;
    await dbConnect();
    const projectData = await Project.findById(id);
    if (!projectData) {
        res.status(404).json({ message: "Project was not found" });
    }
    res.status(200).json(projectData);
}