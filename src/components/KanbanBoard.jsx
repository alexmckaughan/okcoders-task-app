import React, { useEffect, useState } from "react";
import { ColumnContainer } from "./ColumnContainer";
import { Container, Grid, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { UserButton } from "@clerk/nextjs";

function KanbanBoard(props) {
  const [tasks, setTasks] = useState([]);
  const [projectColumns, setProjectColumns] = useState([]);

  async function fetchTasks() {
    const projectId = props.project._id;
    const response = await fetch(`/api/tasks?projectId=${projectId}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched tasks:", data);
      setTasks(data);
    } else {
      console.error("API request failed");
    }
  }

  async function fetchStatuses() {
    const projectId = props.project._id;
    const response = await fetch(`/api/statuses?projectId=${projectId}`);
    if (response.ok) {
      const data = await response.json();
      setProjectColumns(data);
    } else {
      console.error("API request failed");
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
  }, [props.project._id]);

  const columnStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
      marginTop:"10px"
    },
    column: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid black",
      padding: "20px",
    },
  };

  console.log("Tasks for each column: ", projectColumns.map(column => tasks.filter(task => task.status === column.label)));


  return (
    <>
    <Container sx={columnStyles.container}>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {projectColumns.map((column) => (
          <ColumnContainer
            key={column._id}
            column={column}
            tasks={tasks.filter(task => task.status === column._id)}
            fetchTasks={fetchTasks}
            columnStyles={columnStyles}
            project={props.project}
            status={column}
          />
        ))}
      </Grid>
    </Container>
    </>
  );
}

export default KanbanBoard;