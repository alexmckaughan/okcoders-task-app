import React, { useState } from "react";

import { 
    Box, 
    Container, 
    Typography, 
    Grid, Paper, 
    FormControl, 
    Input, 
    InputLabel, 
    Button, 
    TextField,
} from "@mui/material";
import { TaskCard } from "./TaskCard";

export function ColumnContainer(props) {

    const [columnStyles, setColumnStyles] = useState(props.columnStyles);
    const [column, setColumn] = useState(props.column);
    const [tasks, setTasks] = useState(props.tasks);
    const [isVisible , setIsVisible] = useState(false);

    //State to store form input values
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: '',
        due: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };


    //Function to submit form data
    const handleSubmit = async () => {
        try {
        const newTask = {
            title: formData.title,
            description: formData.description,
            status: column.status,
            due: formData.due,
            created: new Date(),
        };
    //Send post request to API

        const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
    console.log("Task added successfully!", newTask);
      } else {
        console.error("Failed to add task.", response.statusText);
      }
      console.log(newTask); 
     } catch (error) {
        console.error("Failed to add task.", error.message);
      }

    };

    const addTaskForm = (
        <Box>
            <TextField
                    id="title"
                    name="title"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    required
                    size="large"
                    value={formData.title}
                    onChange={handleInputChange}
                />

            <TextField
                    id="description"
                    name="description"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    size="large"
                    value={formData.description}
                    onChange={handleInputChange}               
                />

            <InputLabel htmlFor="due">Due Date</InputLabel>
            <Input
                    id="due"
                    name="due"
                    label="Due Date"
                    variant="outlined"
                    fullWidth
                    type="date"
                    size="large"
                    value={formData.due}
                    onChange={handleInputChange}
                />
            </Box>
    );

    const addTaskButton = (<Button onClick={() => setIsVisible(!isVisible)}>Add Task</Button>);
    const cancelTaskButton = (<Button onClick={() => setIsVisible(!isVisible)}>Cancel</Button>);
    const submitTaskButton = <Button onClick={handleSubmit}>Submit</Button>

    return (
        <Grid key={column.id} item xs={12} sm={4}>
            <Paper elevation={3} sx={columnStyles.column}>
                <Typography variant='h4'>{column.title}<hr /></Typography>
                {tasks
                    .filter((task) => task.status === column.status)
                    .map((task) => (
                        <Box key={task._id}>
                            <TaskCard task={task} />
                        </Box>
                    ))}
                <form>
                {isVisible ? addTaskForm : null}
                {isVisible ? submitTaskButton : null}
                {!isVisible ? addTaskButton : cancelTaskButton}
                </form>

            </Paper>
        </Grid>
    );
}