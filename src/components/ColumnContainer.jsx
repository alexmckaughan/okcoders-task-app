import React, { useState } from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { TaskCard } from "./TaskCard";

export function ColumnContainer(props) {

    const [columnStyles, setColumnStyles] = useState(props.columnStyles);
    const [column, setColumn] = useState(props.column);
    const [tasks, setTasks] = useState(props.tasks);

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
            </Paper>
        </Grid>
    );
}
