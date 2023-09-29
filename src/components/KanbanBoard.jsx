import React, { useEffect, useMemo, useState } from "react";
import { ColumnContainer } from "./ColumnContainer";
import { Container, Grid, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";

function KanbanBoard(props) {
  const [tasks, setTasks] = useState([]);
  const [projectColumns, setProjectColumns] = useState([]);
  const columnsId = useMemo(() => projectColumns.map(column => column._id), [projectColumns]);

  const [activeColumn, setActiveColumn] = useState(null);

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
      marginTop: "10px"
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

  function onDragStart(event) {
    console.log("Drag started: ", event);
    if (event.active.data.current?.column) {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }


  return (
    <DndContext onDragStart={onDragStart}>
      <Container sx={columnStyles.container}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <SortableContext items={columnsId}>
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
          </SortableContext>
        </Grid>
      </Container>
      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer key={activeColumn._id}
              column={activeColumn}
              tasks={tasks.filter(task => task.status === activeColumn._id)}
              fetchTasks={fetchTasks}
              columnStyles={columnStyles}
              project={props.project}
              status={activeColumn} />
          )}
        </DragOverlay>, document.body
      )}
    </DndContext>
  );
}

export default KanbanBoard;