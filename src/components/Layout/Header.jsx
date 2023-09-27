import React from 'react';
import {AppBar, Toolbar, Typography, Box } from '@mui/material';
import { UserButton } from "@clerk/nextjs";

export default function Header() {



    return (
        <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PROJECTS
          </Typography>
            <Box>
              <UserButton afterSignOutUrl="/"/>
            </Box>
        </Toolbar>
      </AppBar>
    );


};