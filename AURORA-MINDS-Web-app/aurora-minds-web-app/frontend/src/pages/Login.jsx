import * as React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {login} from '../services/login-register-api.js';
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../utils/constants.js";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

// Alert component for snackbars
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');

    // Show success snackbar if redirected from the registration page
    React.useEffect(() => {
        if (location.state?.registrationSuccess) {
            setSnackbarMessage('Registration successful. Please log in.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    }, [location.state]);

    // Function to handle form submission
    const handleSubmit = async (event) => {
        setLoading(true); // Loading while authorize the token
        event.preventDefault(); // We do not want to reload the page when submit
        const data = new FormData(event.currentTarget); // Get form data
        try {
            // Call login API
            const resp = await login(data.get('email'), data.get('password'));
            // Store tokens and user info in local storage
            localStorage.setItem(ACCESS_TOKEN, resp.access);
            localStorage.setItem(REFRESH_TOKEN, resp.refresh);
            localStorage.setItem('user_role', resp.user.role);
            localStorage.setItem('user_id', resp.user.id);
            navigate('/'); // Redirect to dashboard on successful login
        } catch (err) {
            setError(err.error || 'An error occurred'); // Set error message
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
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Aurora-Minds | Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
                        {/* Email input field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* Password input field */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                        {/*    label="Remember me"*/}
                        {/*/>*/}
                        {/* Error message */}
                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                        {/* Submit button */}
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, mb: 2}}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{width: '50%'}}
                                disabled={loading} // Disable button when loading
                            >
                                Sign In
                            </Button>
                        </Box>
                        <Grid container justifyContent="center">
                            {/*<Grid item xs>*/}
                            {/*    <Link href="#" variant="body2">*/}
                            {/*        Forgot password?*/}
                            {/*    </Link>*/}
                            {/*</Grid>*/}
                            <Grid item>
                                {/* Link to registration page */}
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up!"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 8, mb: 4}}/>
                {/* Snackbar for success messages */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}
