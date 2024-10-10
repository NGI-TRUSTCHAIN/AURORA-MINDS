import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Grid, IconButton, Paper, TextField, Typography} from '@mui/material';
import {Close} from '@mui/icons-material';
import {getUserByRole} from '../../services/user-api.js';

// Modal component to display user details based on user ID and role
const UserModal = ({userId, role, onClose}) => {
    const [userDetails, setUserDetails] = useState(null);  // State to hold user details
    const [loading, setLoading] = useState(true);  // State to manage loading state

    // Fetch user details when the userId or role props change
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const data = await getUserByRole(userId, role);  // Fetch user details from API
                setUserDetails(data);  // Set user details state
                setLoading(false);  // Set loading to false after data is fetched
            } catch (err) {
                console.error('Failed to fetch user details', err);  // Log error if fetching fails
                setLoading(false);  // Set loading to false even if there is an error
            }
        };

        fetchUserDetails();
    }, [userId, role]);

    return (
        <Paper
            sx={{
                p: 4,
                margin: 'auto',
                maxWidth: 500,
                flexGrow: 1,
                overflow: 'auto',
                height: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/* Close button for the modal */}
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{position: 'absolute', top: 8, right: 8}}
            >
                <Close/>
            </IconButton>
            {/* Modal title */}
            <Typography variant="h6" component="h2" gutterBottom>
                Information
            </Typography>
            {/* Show loading spinner if data is still being fetched */}
            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box sx={{mt: 2}}>
                    {/* Display user details if available */}
                    {userDetails ? (
                        <Grid container spacing={2}>
                            {/* First Name Field */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={userDetails.first_name}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            {/* Last Name Field */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={userDetails.last_name}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            {/* Email Field */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    value={userDetails.email}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            {/* Contact Number Field */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Contact Number"
                                    value={userDetails.contact_number}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                            {/* Role Field */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Role"
                                    value={userDetails.role}
                                    InputProps={{readOnly: true}}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Typography variant="body1">No user details available</Typography>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default UserModal;
