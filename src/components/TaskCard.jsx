import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Collapse,
    Stack,
    Box,
    TextField,
    Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useAuth } from "@clerk/nextjs";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSensor, useSensors, PointerSensor } from "@dnd-kit/core";

export function TaskCard(props) {
    const { userId } = useAuth();
    const { task, project, status, isNewTask = false } = props;
    const initialTask = isNewTask ? {
        title: '',
        description: '',
        project: project._id,
        status: status._id,
        createdBy: userId,
        modifiedBy: userId,
        due: new Date().toISOString()
    } : task;
    const [localTask, setLocalTask] = useState(initialTask);
    const [expanded, setExpanded] = useState(false);
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
        useSortable({
            id: props.task._id,
            data: {
                task: props.task,
                project: props.project,
                status: props.status,
                type: "task",
            }
        });
    const [isBeingDragged, setIsBeingDragged] = useState(false);

    useEffect(() => {
        setIsBeingDragged(isDragging);
    }, [isDragging]);

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleApiResponse = async (response, successMessage) => {
        if (response.ok) {
            console.log(successMessage);
        } else {
            const data = await response.json();
            console.error('Error:', data.error || 'Unknown error');
        }
    };

    const onCreate = async () => {
        try {
            const response = await fetch("/api/tasks/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(localTask),
            });

            const data = await response.json();
            if (response.ok) {
                console.log(`${localTask.title} was created successfully`);
                setLocalTask(data);
                if (props.onCreate) {
                    props.onCreate(data);
                }
            } else {
                console.error('Error:', data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error creating task:', error.message);
        }
    };


    const onCancel = () => {
        if (props.onCancel) {
            props.onCancel();
        }
    };

    const onInputChange = (property, e) => {
        const newValue = e.target.value;
        setLocalTask(prevTask => ({ ...prevTask, [property]: newValue }));
    };

    const onSave = async () => {
        try {
            const taskToSave = isNewTask
                ? localTask : {
                    ...localTask,
                    modifiedBy: userId,
                };
            const response = await fetch("/api/tasks/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskToSave),
            });

            handleApiResponse(response, `${localTask.title} was updated successfully`);
        } catch (error) {
            console.error('Error updating task:', error.message);
        }
    };

    const handleDeleteTask = async () => {
        try {
            if (!localTask._id) {
                console.error("Task does not have an id");
                return;
            }

            const response = await fetch(`/api/tasks?id=${localTask._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 200) {
                alert(`"${localTask.title}" was deleted successfully`);
                if (props.onDelete) {
                    props.onDelete(localTask._id);
                }
            } else {
                const data = await response.json();
                console.error('Error deleting:', data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Error deleting task:', err.message);
        }
    };

    const handleDeleteAlert = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            handleDeleteTask();
        }
    };

    if (isDragging) {
        return (
            <Card
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                sensors={sensors}
                sx={{ maxWidth: 345 }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TextField
                        name="title"
                        value={localTask.title}
                        onChange={(e) => onInputChange("title", e)}
                        placeholder="Title"
                        fullWidth
                        size="small"
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            sx={{ maxWidth: 345 }}
        >
            <CardContent
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TextField
                    name="title"
                    value={localTask.title}
                    onChange={(e) => onInputChange("title", e)}
                    placeholder="Title"
                    fullWidth
                    size="small"
                    onFocus={() => !isBeingDragged && setExpanded(true)}
                    onBlur={() => !isBeingDragged && setExpanded(false)}
                />
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit={false}>
                <Box sx={{ pointerEvents: "auto" }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    name="due"
                                    value={dayjs(localTask.due)}
                                    onChange={(date) =>
                                        setLocalTask((prev) => ({
                                            ...prev,
                                            due: date.toISOString(),
                                        }))
                                    }
                                    slotProps={{ textField: { fullWidth: true, size: "small" } }}
                                />
                            </LocalizationProvider>
                            <TextField
                                name="description"
                                value={localTask.description}
                                onChange={(e) => onInputChange("description", e)}
                                placeholder="Description"
                                multiline
                                fullWidth
                                size="small"
                                maxRows={4}
                            />
                            <TextField
                                name="project"
                                value={project._id}
                                disabled
                                fullWidth
                                size="small"
                                label="Project ID"
                            />
                            <TextField
                                name="status"
                                value={status._id}
                                disabled
                                fullWidth
                                size="small"
                                label="Status ID"
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {!isNewTask && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={onSave}
                                            size="small"
                                            sx={{ margin: "0 5px" }}
                                        >
                                            SAVE
                                        </Button>
                                        <Button
                                            onClick={handleDeleteAlert}
                                            size="small"
                                            sx={{ margin: "0 5px" }}
                                        >
                                            DELETE
                                        </Button>
                                    </>
                                )}
                                {isNewTask && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={onCreate}
                                            size="small"
                                            sx={{ margin: "0 5px" }}
                                        >
                                            CREATE
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={onCancel}
                                            size="small"
                                            sx={{ margin: "0 5px" }}
                                        >
                                            CANCEL
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Stack>
                    </CardContent>
                </Box>
            </Collapse>
        </Card>
    );

}

export default TaskCard;
