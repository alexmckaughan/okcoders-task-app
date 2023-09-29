import React from 'react';
import { Typography } from '@mui/material';

export default function Footer() {





    return (
        <footer style={{ textAlign: 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                @ {new Date().getFullYear()} - All Rights Reserved
            </Typography>
        </footer>
    );
}