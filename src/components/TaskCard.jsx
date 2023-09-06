import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Collapse,
    Stack,
    TextField,
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

    return (
        <Card
            sx={{ maxWidth: 345 }}
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
                    onFocus={() => setExpanded(true)}
                    onBlur={() => setExpanded(false)}
                ></TextField>
            </CardContent>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
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
                    </Stack>
                </CardContent>
            </Collapse>
        </Card>
    );
}
