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

    const { task, fetchTasks } = props;
    const [expanded, setExpanded] = useState(false);
    const [localTask, setLocalTask] = useState(task);


    const handleInputChange = (property, e) => {
        const newValue = e.target.value;
        setLocalTask((prevTask) => ({
            ...prevTask,
            [property]: newValue,
        }));
    };

    //Save task function
    const handleSaveTask = async () => {
        try {
            const response = await fetch("/api/tasks/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(localTask),
            });

            if (response.ok) {
                console.log(`${localTask.title} was updated successfully in the handleSaveTask function`)
                const createdTask = await response.json();


            } else {
                prompt("error updating")
            }
        } catch (error) {
            console.log("unknown error")
        }
    };

    //Delete task function
    const handleDeleteTask = async () => {
        try {
            console.log(localTask._id);
            console.log(localTask)
            if (!localTask._id) {
                console.error('Task does not have an id');
                return;
            }

            const response = await fetch(`/api/tasks?id=${localTask._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.status === 200) {
                alert(`"${localTask.title}" was deleted successfully`);
                fetchTasks();
                // window.location.reload();
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
                    value={localTask.title}
                    onChange={(e) => handleInputChange('title', e)}
                    placeholder="Title"
                    fullWidth
                    size="small"
                ></TextField>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit={false} >
                {/* By adding this div around the CardContent I was able to click on the calender in order to update task due dates */}
                <Box sx={{ pointerEvents: "auto" }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={dayjs(localTask.due)}
                                    onChange={(date) => setLocalTask(prev => ({ ...prev, due: date.toISOString() }))}
                                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                                />
                            </LocalizationProvider>
                            <TextField
                                value={localTask.description}
                                onChange={(e) => handleInputChange('description', e)}
                                placeholder="Description"
                                multiline
                                fullWidth
                                size="small"
                                maxRows={4}
                            />
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button variant="outlined" onClick={handleSaveTask} size="small" sx={{ width: "10px" }}>
                                    Save
                                </Button>
                                <Button onClick={handleDeleteAlert} size="small" sx={{ width: "10px" }}>
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
