import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function taskByIdPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tasks, setTasks] = useState({});

  async function fetchTask() {
    const response = await fetch(`/api/tasks/${id}`);
    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    if (!id) return;
    fetchTask();
  }, [id]);

  return (
    <Box>
      <p>This is my taskByIdPage</p>
      <p>Name: {tasks.name}</p>
    </Box>
  );
}
