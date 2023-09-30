import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Container from '@mui/material/Container';

export default function Layout({ children }) {

    const layoutStyle = {
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        minHeight: '100vh',
    }

    return (
        <div style={layoutStyle}>
        <Header />
        <Container maxWidth="xl" style={{ marginTop: '20px',}}>
            {children}
        </Container>
        <Footer />
        </div>
    );
    }