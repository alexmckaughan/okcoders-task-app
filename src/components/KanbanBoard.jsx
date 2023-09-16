import React from 'react';
import { ColumnContainer } from './ColumnContainer';
import { Container, Grid } from '@mui/material';

function KanbanBoard(props) {

  console.log("props.tasks", props.tasks);

  const columns = [
    { id: "todo", title: "PENDING", status: "Pending" },
    { id: "inProgress", title: "IN PROGRESS", status: "In Progress" },
    { id: "done", title: "COMPLETED", status: "Completed" },
  ];

  const columnStyles = {
    container: {
      display: "flex",
      flexDirection: "column",
    },
    column: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid black",
      padding: "20px",
    },
  };

  return (
    <Container sx={columnStyles.container}>
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {columns.map((column) => (
          <ColumnContainer key={column.id} column={column} tasks={props.tasks} fetchTasks={props.fetchTasks} columnStyles={columnStyles} />
        ))}
      </Grid>
    </Container>
  );
};

export default KanbanBoard;