import { useEffect, useState } from "react";
import KanbanBoard from "../../components/KanbanBoard";
import { useRouter } from "next/router";

export default function Projects() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  async function fetchTasks() {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        console.log("data: ", data);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Unknown error", error);
    }
  }

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        console.log("data: ", data);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Unknown error", error);
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  return (
    <>
      {/* {tasks.length > 0 && (
        <KanbanBoard tasks={tasks} fetchTasks={fetchTasks} />
      )} */}
      {projects.length > 0 &&
        projects.map((project) => {
          <KanbanBoard project={project} />;
        })}
      {/* Insert ColumnContainer.jsx here */}
      {/* <ColumnContainer tasks={tasks} /> */}
      {/* {tasks[0] && <TaskCard task={tasks[0]} />} */}
    </>
  );
}
