import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ColumnContainer } from "@/components/ColumnContainer";

export default function taskByIdPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tasks, setTasks] = useState({});

  async function fetchTask() {
    const response = await fetch(`/api/projects/${id}`);
    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    if (!id) return;
    fetchTask();
  }, [id]);
console.log(tasks)
  return (
    <Box>
      <p>This is my taskByIdPage</p>
      <p>Name: {tasks.title}</p>

      {/* Pass the id to the ColumnContainer component */}
      <ColumnContainer title="Your Column Title" tasks={tasks} id={id} />
    </Box>
  );
}
