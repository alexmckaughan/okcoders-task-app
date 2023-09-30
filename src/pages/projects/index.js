import { useEffect, useMemo, useState } from "react";
import KanbanBoard from "../../components/KanbanBoard";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const renderedBoards = useMemo(() => {
    return projects.map((project) => (
      <KanbanBoard key={project._id} project={project} />
    ));
  }, [projects]);

  return <>{renderedBoards}</>;
}
