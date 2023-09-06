import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { ColumnContainer } from './ColumnContainer';
import { Container, Grid } from '@mui/material';

function KanbanBoard(props) {
  const [parent, setParent] = useState(null);
  const [tasks, setTasks] = useState(props.tasks);

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
          <ColumnContainer key={column.id} column={column} tasks={tasks} columnStyles={columnStyles} />
        ))}
      </Grid>
    </Container>
  );
};

export default KanbanBoard;