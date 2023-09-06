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
//droppable component
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
                       {props.tasks
                .filter((task) => task.status === column.status)
                .map((task) => (
                  <div key={task.id}>
                    <TaskCard task={task} />
                  </div>
                ))}
                       </Paper>
                   </Grid>
                 ))}
            </Grid>
        </Container>
    )
}
//     //Makes the component a droppable area
//     const {setNodeRef, isOver } = useDroppable({
//         id: props.id,
//         data: {
//           index: props.index,
//         },
//       });
    
//        const filteredTasks = props.tasks.filter((task) => task.status === props.status);
//       //will handle updates to task
//       const handleUpdateTask = (updatedTask) =>{
// console.log("handle updated task")
//       } 

//     return (
//         <>
//         {/* background color changes if it is being dragged over */}
//           <Box ref={setNodeRef}
//           style={{
//             backgroundColor: isOver ? 'lightblue' : 'white',
//           }}>
           
//             <Container>
//              <Typography variant='h4'>{props.title}</Typography>
//              {filteredTasks.map((task, index) => (
//           <TaskCard key={index} task={task} onUpdateTask={handleUpdateTask} />
//         ))}  
        
//            </Container> 
           
            
            
//             </Box>
//             </>
//     );
// }

 
     