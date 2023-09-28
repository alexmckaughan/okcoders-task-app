import { useEffect, useMemo, useState } from "react";
import KanbanBoard from "../../components/KanbanBoard";


export default function Projects() {
  const [projects, setProjects] = useState([]);
  
  async function fetchProjects() {
    console.log("Projects Page: Fetching projects data...");
    try {
     
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        console.log("Projects Page: Setting projects data:", data);
        setProjects(data);
      } else {
        console.error("Projects Page: API request failed");
      }
    } catch (error) {
      console.error("Projects Page: Unknown error", error);
    }
  }

  useEffect(() => {
    console.log("Projects Page: useEffect triggered (initial fetch)");
    fetchProjects();
  }, []);

  const renderedBoards = useMemo(() => {
    console.log(
      "Projects Page: Recalculating renderedBoards due to change in projects."
    );
    return projects.map((project) => (
      <KanbanBoard key={project._id} project={project} />
    ));
  }, [projects]);

  console.log("Projects Page: Rendering...");

  return <>{renderedBoards}</>;
}
