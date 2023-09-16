import { useEffect, useState } from "react";
import KanbanBoard from "../../components/KanbanBoard";
import { useRouter } from "next/router";
// import { TaskCard } from "@/components/TaskCard";
// import { ColumnContainer } from "@/components/ColumnContainer";

export default function Tasks() {
  //useState to update tasks to an array that is fetched from the the api in function fetchTasks()
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  //fetching the tasks from api/tasks and putting the results into variable response

  async function fetchTasks() {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        console.log("tasks: ", tasks);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Unknown error", error);
    }
  }

  useEffect(() => {
    console.log("tasks updated: ", tasks);
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      {tasks.length > 0 && (
        <KanbanBoard tasks={tasks} fetchTasks={fetchTasks} />
      )}
      {/* Insert ColumnContainer.jsx here */}
      {/* <ColumnContainer tasks={tasks} /> */}
      {/* {tasks[0] && <TaskCard task={tasks[0]} />} */}
    </>
  );
}
