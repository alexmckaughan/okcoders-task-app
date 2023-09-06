import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';

const columnStyles = {
    container:{
        
        display:'flex',
        flexDirection:'column',
        
    },
    column: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        border: '1px solid black',
        padding:'20px',
    },
};

 export function ColumnContainer(props) {
    const columns = [
        { id: 'todo', title: 'PENDING', status: 'Pending' },
        { id: 'inProgress', title: 'IN PROGRESS', status: 'In Progress' },
        { id: 'done', title: 'COMPLETED', status: 'Completed'},
    ];  

    console.log('Columns:', columns);
    return (
        <Container sx={columnStyles.container}>
            <Grid container spacing={2} sx={{ flexGrow:1 }}>
                {columns.map((column) =>(
                   <Grid key={column.id} item xs={12} sm={4}>
                       <Paper elevation={3} sx={columnStyles.column}>
                       <Typography variant='h4'>{column.title}<hr/></Typography> 
                       {/* Filter through my task.  If the status of the task matches the status of the 
                       column, it will be placed in that column */}
                       {props.tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <Box key={task._id}>
                    <TaskCard  task={task} />
                  </Box>
                ))}
                       </Paper>
                   </Grid>
                 ))}
            </Grid>
        </Container>
    )
}


 
     