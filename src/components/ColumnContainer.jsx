import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskCard } from "./TaskCard";
import { useRouter } from "next/router";
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities"
import { StyleRegistry } from "styled-jsx";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

  const [isHover, setIsHover] = useState(false);
  const [columns, setColumns] = useState([]);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const handleMouseAction = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  }

  const deleteStyle = {
    display: isHover ? "block" : "none",
  }

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

  const handleDeleteAlert = () => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      onDeleteColumn(props.column._id);
    }
  };

  const onDeleteColumn = async (columnId) => {
    try {
      const response = await fetch(`/api/statuses?id=${props.column._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log("Column Deleted Successfully");
        if (props.onDeleteColumn) {
          props.onDeleteColumn(columnId);
        }
      } else {
        console.error('Error:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error deleting column:', error.message);
    }
  };

  return (
    <Grid ref={setNodeRef} style={style} key={props.column._id} item xs={12} sm={4} >
      <Paper elevation={3} sx={props.columnStyles.column} {...attributes} {...listeners} {...handleMouseAction}>
        <Typography variant="h4" style={{ textAlign: "center", display: "flex", justifyContent: "space-between", }}>
          {props.column.label}
          <Button onClick={handleDeleteAlert}>
            <DeleteIcon
              style={deleteStyle}
            />
          </Button>
        </Typography>
        <hr />
        <Stack spacing={1}>
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
          </SortableContext>
        </Stack>
      </Paper>
      <Button style={{
        position: "relative",
        bottom: "2.7em",
        left: ".1em",
        width: "99%",
        backgroundColor: "white"
      }}
        onClick={() => setShowNewTask(true)}>
        <AddCircleOutlineIcon sx={{ mr: 1 }} />ADD TASK
      </Button>
    </Grid>
  );
}
export default ColumnContainer;
