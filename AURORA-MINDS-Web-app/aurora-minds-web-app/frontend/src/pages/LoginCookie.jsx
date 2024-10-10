import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Box, Typography, Container, CssBaseline, Avatar, Snackbar, Alert, Link, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../utils/constants.js";
import { authenticateWithCookie } from "../services/login-register-api.js";

// Component to display copyright information
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                DOTSOFT SA
            </Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    );
}

// Default MUI theme
const defaultTheme = createTheme();

export default function LoginCookie() {
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(false);

    // Function to handle login with cookie
    const handleLogin = async () => {
        // Set loading to true to indicate the login process has started and freeze the button while loading
        setLoading(true);
        try {
            // Call authenticate API
            const resp = await authenticateWithCookie();
            // Store tokens and user info in local storage
            localStorage.setItem(ACCESS_TOKEN, resp.access);
            localStorage.setItem(REFRESH_TOKEN, resp.refresh);
            localStorage.setItem('user_role', resp.user.role);
            localStorage.setItem('user_id', resp.user.id);
            navigate('/'); // Redirect to dashboard on successful login
        } catch (err) {
            setSnackbarMessage(err.error || 'An error occurred');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setLoading(false); // Stop loading
        }
    };

    // Function to handle snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minHeight: '80vh', // Adjust the minimum height to help center content
                        justifyContent: 'center' // Center content vertically
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Aurora-Minds | Welcome
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 35 }}>
                            <Button
                                variant="contained"
                                sx={{ width: '100%' }}
                                disabled={loading} // Disable button when loading
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                    {/* Snackbar for success and error messages */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                    >
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 8,
                        mb: 4,
                        position: 'absolute', // Make it stay at the bottom
                        bottom: 16, // Adjust this value as needed
                        left: 0,
                        right: 0
                    }}
                >
                    <Copyright />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
