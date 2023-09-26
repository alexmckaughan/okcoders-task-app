import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { TaskCard } from "./TaskCard";
import { useRouter } from "next/router";

export function ColumnContainer(props) {
  const router = useRouter();
  const { id } = router.query;

  const [showNewTask, setShowNewTask] = useState(false);

  const handleCreateNewTask = (newTask) => {
    props.tasks.push(newTask);
    setShowNewTask(false);
  };

  const handleCancelNewTask = () => {
    setShowNewTask(false);
  };

  const handleDeleteTask = (deletedTaskId) => {
    const updatedTasks = props.tasks.filter(task => task._id !== deletedTaskId);
    props.fetchTasks(updatedTasks);
  };

  return (
    <Grid key={props.column._id} item xs={12} sm={4}>
      <Paper elevation={3} sx={props.columnStyles.column}>
        <Typography variant="h4">
          {props.column.label}
          <hr />
        </Typography>
        {props.tasks.map((task) => (
          <Box key={task._id}>
            <TaskCard
              project={props.project}
              status={props.status}
              task={task}
              fetchTasks={props.fetchTasks}
              onDelete={handleDeleteTask}
            />
          </Box>
        ))}
        {showNewTask && (
          <TaskCard
            isNewTask
            project={props.project}
            status={props.status}
            onCreate={handleCreateNewTask}
            onCancel={handleCancelNewTask}
          />
        )}
        <Button onClick={() => setShowNewTask(true)}>ADD</Button>
      </Paper>
    </Grid>
  );
}

export default ColumnContainer;
