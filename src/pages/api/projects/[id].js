import dbConnect from "../../../server/db";
import Project from "../../../server/models/Project";
import { getAuth } from "@clerk/nextjs/server";

export default async function projectById(req, res) {
    const { userId } = getAuth(req);
    const { id } = req.query;
    await dbConnect();
    const projectData = await Project.findById(id);
    if (!projectData) {
        res.status(404).json({ message: "Project was not found" });
    }
    res.status(200).json(projectData);
}