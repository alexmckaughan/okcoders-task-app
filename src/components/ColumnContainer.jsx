import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import { TaskCard } from "./TaskCard";
import { useRouter } from "next/router";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities"
import { StyleRegistry } from "styled-jsx";

export function ColumnContainer(props) {
  const router = useRouter();
  const { id } = router.query;
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: props.column._id,
      data: {
        column: props.column,
        tasks: props.tasks,
        project: props.project,
        type: "column",
      }
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const taskIds = useMemo(() => props.tasks.map(task => task._id), [props.tasks]);

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
    <Grid ref={setNodeRef} style={style} key={props.column._id} item xs={12} sm={4}>
      <Paper elevation={3} sx={props.columnStyles.column} {...attributes} {...listeners}>
        <Typography variant="h4">
          {props.column.label}
          <hr />
        </Typography>
        <Stack spacing={1} >
          <SortableContext items={taskIds}>
            {props.tasks.map((task) => (
              <Box key={task._id}>
                <TaskCard
                  project={props.project}
                  status={props.status}
                  task={task}
                  fetchTasks={props.fetchTasks}
                  onDelete={handleDeleteTask}
                  type="task"
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
                type="task"
              />
            )}
            <Button onClick={() => setShowNewTask(true)}>ADD TASK</Button>
          </SortableContext>
        </Stack>
      </Paper>
    </Grid>
  );
}

export default ColumnContainer;
