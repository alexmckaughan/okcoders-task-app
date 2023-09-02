import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Box } from "@mui/material";
import KanbanBoard from "../../components/KanbanBoard";

export default function Tasks() {
  //useState to update tasks to an array that is fetched from the the api in function fetchTask()
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  //fetching the tasks from api/tasks and putting the results into variable response
  async function fetchTask() {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data);
    console.log("tasks", tasks);
  }

  useEffect(() => {
    fetchTask();
  }, []);

  console.log(tasks);
  return (
    <>
      <KanbanBoard tasks={tasks}></KanbanBoard>
    </>
  );
}
