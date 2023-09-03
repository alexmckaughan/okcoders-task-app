import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { ColumnContainer } from './ColumnContainer';
import { TaskCard } from './TaskCard';

function KanbanBoard({ tasks }) {
    const [parent, setParent] = useState(null);

    console.log("tasks", tasks);

    return (
        <></>
    );
};

export default KanbanBoard;