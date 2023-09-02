import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { ColumnContainer } from './ColumnContainer';
import { TaskCard } from './TaskCard';

function KanbanBoard({ tasks }) {
    const [parent, setParent] = useState(null);

    console.log("tasks", tasks);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {parent === null ? <TaskCard id="draggable">Drag me</TaskCard> : null}

            {tasks.map((task) => (
                <ColumnContainer key={task._id} id={task._id}>
                    {parent === task._id ? <TaskCard TaskCard id={task._id}>{task.name}</TaskCard> : 'Drop here'}
                </ColumnContainer>
            ))
            }
        </DndContext >
    );

    function handleDragEnd(event) {
        const { over } = event;

        // If the item is dropped over a container, set it as the parent
        // otherwise reset the parent to `null`
        setParent(over ? over.id : null);
    }
};

export default KanbanBoard;