import dbConnect from "../../../server/db";
import Project from "../../../server/models/Project";
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { userId } = getAuth(req);
    console.log(userId)
    console.log("API request received");
    await dbConnect();

    if (req.method === "POST") {
        const project = await Project.create(req.body);
        res.status(201).json(project);
        console.log(req.body);
    } else if (req.method === "GET") {
        const projects = await Project.find({});
        res.status(200).json(projects);
        console.log(req.query);
    }
}
        // else if (req.method === "PUT")
        // In what case would we need to handle a put request for the projects api?

        // else if (req.method === "DELETE")
        // Should this delete all task associated with the corresponding project?
