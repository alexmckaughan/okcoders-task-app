import React, { useEffect, useMemo, useState } from "react";
import { ColumnContainer } from "./ColumnContainer";
import { Container, Grid, Paper, Button, Typography } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from "react-dom";

// Moved columnStyles outside of the component to prevent re-creation on each render
const columnStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    marginTop: "10px",
    overflowX: "auto",
    justifyContent: "space-evenly",

  },
  column: {
    border: "1px solid black",
    padding: "20px",
    width: "18rem",
    height: "30em",
    overflowY: "auto",
  },
};

const newColumnStyles = {
  border: "1px solid black",
  marginTop: "2em",
  marginLeft: "1.5em",
}

const buttonStyle = {
width: "18em",
height: "auto",
alignItems: "center",
}

function KanbanBoard(props) {
  const [tasks, setTasks] = useState([]);
  const [projectColumns, setProjectColumns] = useState([]);
  const [columns, setColumns] = useState([]); // Added this state
  const columnsId = useMemo(() => columns.map(column => column._id), [columns]);
  const [localTasks, setLocalTasks] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");

  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    // Added error handling
    fetchTasks().catch(e => console.error("Failed fetching tasks:", e));
    fetchStatuses().catch(e => console.error("Failed fetching statuses:", e));
  }, [props.project._id]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  async function fetchTasks() {
    try {
      const projectId = props.project._id;
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  async function fetchStatuses() {
    try {
      const projectId = props.project._id;
      const response = await fetch(`/api/statuses?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProjectColumns(data);
        setColumns(data);  // Also update columns
      } else {
        console.error("API request failed");
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    }
  }

  const onColumnCreate = async () => {
    try {
        const nextColumnNumber = columns.length + 1;
        const columnName = `Column ${nextColumnNumber}`;

        const response = await fetch("/api/statuses/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              label: columnName,
              project: props.project,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("New Column Created Successfully");
            setColumns((prevColumns) => [...prevColumns, data]);
            setNewColumnName("");
            if (props.onCreate) {
                props.onCreate(data);
            }
            setActiveColumn(data.id);

        } else {
            console.error('Error:', data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error creating column:', error.message);
    }
};
      

  function onDragStart(event) {
    const { active } = event;
    if (active.data.current?.column?.type === "Column") {
      setActiveColumn(active.data.current.column);
    } else if (active.data.current?.task?.type === "Task") {
      setActiveTask(active.data.current.task);
    }
    console.log("Drag started:", event);
  }


  function onDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    setActiveColumn(null);
    setActiveTask(null);

    if (active.id === over.id) return;

    setColumns((prevColumns) => {
      const activeIndex = prevColumns.findIndex((col) => col._id === active.id);
      const overIndex = prevColumns.findIndex((col) => col._id === over.id);
      if (activeIndex !== -1 && overIndex !== -1) {
        return arrayMove(prevColumns, activeIndex, overIndex);
      }
      return prevColumns;
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === "Task";
    if (isActiveATask) {
      setLocalTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((task) => task._id === active.id);
        const overIndex = prevTasks.findIndex((task) => task._id === over.id);

        if (activeIndex !== -1 && overIndex !== -1) {
          if (prevTasks[activeIndex].status !== prevTasks[overIndex].status) {
            prevTasks[activeIndex].status = prevTasks[overIndex].status;
          }
          return arrayMove(prevTasks, activeIndex, overIndex);
        }
        return prevTasks;
      });
    }
  }


  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
      <Container style={columnStyles.container}>
        <Grid 
        container
        columns='auto'
        alignItems="flex-start"
        spacing={4}
        wrap="nowrap"
       
         >
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <ColumnContainer
                key={column._id}
                column={column}
                tasks={localTasks.filter(task => task.status === column._id)}
                fetchTasks={fetchTasks}
                columnStyles={columnStyles}
                project={props.project}
                status={column}
              >
                
              </ColumnContainer>

            ))}
            <Paper style={newColumnStyles}>
              <Button onClick={onColumnCreate} style={buttonStyle}>

                <Typography variant="h5" style={{textAlign: "center"}}>
                <AddCircleOutlineIcon /> New Column
                </Typography>
              </Button>
            </Paper>
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
              status={activeColumn}
            />
          )}
        </DragOverlay>, document.body
      )}
    </DndContext>
  );
}

export default KanbanBoard;