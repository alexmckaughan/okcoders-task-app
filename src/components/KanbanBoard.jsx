import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { ColumnContainer } from './ColumnContainer';
import { TaskCard } from './TaskCard';

function KanbanBoard({ tasks }) {
    const [parent, setParent] = useState(null);

    console.log("tasks", tasks);

    return (
        <>
          {/* <div title= {"TO DO"} task={incomplete} id={"1"}></div> */}
          {/* <button>ADD COLUMN</button> */}
        </>
    );
};

export default KanbanBoard;