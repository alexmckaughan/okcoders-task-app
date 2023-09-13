import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Collapse,
    Stack,
    Box,
    TextField,
    Button
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import dayjs from 'dayjs';

export function TaskCard(props) {
    
    const [expanded, setExpanded] = useState(false);
    const [task, setTask] = useState(props.task);
  

    const handleInputChange = (property, e) => {
        const newValue = e.target.value;
        setTask((prevTask) => ({
            ...prevTask,
            [property]: newValue,
        }));
    };

    const handleSaveTask = async () => {
        try{
            const response = await fetch("/api/tasks/", {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(task),
            });

            if(response.ok){
                console.log(`${task.title} was updated successfully in the handleSaveTask function`)
            } else {
                prompt("error updating")
            }
        } catch (error){
              console.log("unknown error")
        }
    };
    const handleDeleteTask = async () => {
        try {
            console.log(task._id);
            console.log(task)
            if (!task._id) {
                console.error('Task does not have an id');
                return;
            }

            const response = await fetch(`/api/tasks?id=${task._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                
            });
            if (response.status === 200) {
                alert(`"${task.title}" was deleted successfully`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAlert = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            handleDeleteTask();
        }
    };

    return (
        <Card
            sx={{ maxWidth: 345 }}
            onFocus={() => setExpanded(true)}
            onBlur={() => setExpanded(false)}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <TextField
                    value={task.title}
                    onChange={(e) => handleInputChange('title', e)}
                    placeholder="Title"
                    fullWidth
                    size="small"
                ></TextField>
            </CardContent>
            <Collapse in={expanded}  timeout="auto" unmountOnExit = {false} >
                {/* By adding this div around the CardContent I was able to click on the calender in order to update task due dates */}
                <Box sx={{ pointerEvents: "auto" }}>
                <CardContent>
                    <Stack spacing={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(task.due)}
                                onChange={(date) => setTask(prev => ({ ...prev, due: date.toISOString() }))}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </LocalizationProvider>
                        <TextField
                            value={task.description}
                            onChange={(e) => handleInputChange('description', e)}
                            placeholder="Description"
                            multiline
                            fullWidth
                            size="small"
                            maxRows={4}
                        />
                        <Box sx={{display: "flex", justifyContent:"center"}}>
                        <Button variant="outlined" onClick={handleSaveTask} size="small" sx={{  width: "10px" }}>
                            Save
                        </Button>
                        <Button onClick={handleDeleteAlert} size="small" sx={{  width: "10px" }}>
                            Delete
                        </Button>
                        </Box>
                    </Stack>
                </CardContent>
                </Box>
            </Collapse>
        </Card>
    );
}
