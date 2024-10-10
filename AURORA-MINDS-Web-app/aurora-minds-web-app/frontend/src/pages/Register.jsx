import React, {useState} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {registerUser} from "../services/login-register-api.js";
import {useNavigate} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

// Default MUI theme
const defaultTheme = createTheme();

// Alert component for snackbars
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [role, setRole] = useState('PARENT');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const payload = {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            contact_number: contactNumber,
            role
        };
        console.log('Payload:', payload); // Log payload for debugging
        try {
            // Call register API
            await registerUser(payload);
            navigate('/login', {state: {registrationSuccess: true}}); // Redirect to login on successful registration with state
        } catch (err) {
            setSnackbarMessage(err.message);  // Set error message
            setSnackbarOpen(true);
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
            <Container component="main" maxWidth="md">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    {/* Avatar and title */}
                    <Avatar sx={{m: 1, bgcolor: "secondary.main"}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    {/* Registration form */}
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            {/* First Name input */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    sx={{mb: 2}}
                                />
                            </Grid>
                            {/* Last Name input */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    sx={{mb: 2}}
                                />
                            </Grid>
                            {/* Email input */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{mb: 2}}
                                />
                            </Grid>
                            {/* Password input */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{mb: 2}}
                                />
                            </Grid>
                            {/* Contact Number input */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="contactNumber"
                                    label="Contact Number"
                                    name="contactNumber"
                                    autoComplete="tel"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    sx={{mb: 2}}
                                />
                            </Grid>
                            {/* Role selection */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    name="role"
                                    label="Role"
                                    select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    sx={{mb: 2}}
                                >
                                    <MenuItem value="PARENT">PARENT</MenuItem>
                                    <MenuItem value="CLINICIAN">CLINICIAN</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        {/* Error message */}
                        {error && (
                            <Typography color="error" variant="body2" sx={{mt: 2}}>
                                {error}
                            </Typography>
                        )}
                        {/* Submit button */}
                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, mb: 2}}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{width: '40%'}} // Changed to set a shorter width and center it
                            >
                                Register
                            </Button>
                        </Box>
                        {/* Link to login page */}
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                {/* Snackbar for error messages */}
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
