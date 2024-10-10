import React, {useState} from 'react';
import {Box, Button, Grid, IconButton, Modal, Paper, TextField, Typography} from '@mui/material';
import {Close} from '@mui/icons-material';
import {updateParentChild} from '../../services/child-api';
import ModalErrorSnackbar from './ModalErrorSnackbar';

/**
 * Modal component for editing a child's record.
 *
 * This component provides a form for updating the first and last name
 * of a child. The form is displayed in a modal and sends the update
 * request to the backend API when submitted.
 */
const ChildEditModal = ({child, onClose, onUpdateSuccess, onUpdateFailure}) => {
    const [formData, setFormData] = useState({
        child_id: child.child_id,
        first_name: child.first_name,
        last_name: child.last_name,
        score: child.score,
        parent_id: child.parent_id.id,
        clinician_id: child.clinician_id.id
    });

    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Handle input change events for form fields
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send update request to the backend API
            await updateParentChild(formData);
            onUpdateSuccess();
            onClose(); // Close the modal on success
        } catch (err) {
            console.error('Failed to update child record', err);
            setSnackbarMessage(err.message || 'Failed to update child record');
            setSnackbarOpen(true);
            onUpdateFailure(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Modal
            open
            onClose={onClose}
            aria-labelledby="edit-child-modal-title"
            aria-describedby="edit-child-modal-description"
            sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} // Center the modal
        >
            <Paper sx={{p: 4, maxWidth: 400, width: '100%', position: 'relative'}}>
                {/* Close button for the modal */}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{position: 'absolute', top: 8, right: 8}}
                >
                    <Close/>
                </IconButton>

                {/* Modal title */}
                <Typography variant="h6" component="h2" id="edit-child-modal-title" gutterBottom>
                    Edit Child Record
                </Typography>

                {/* Form for editing child record */}
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                    {/* First Name Field */}
                    <TextField
                        fullWidth
                        label="First Name"
                        value={formData.first_name}
                        name="first_name"
                        onChange={handleChange}
                        required
                        sx={{mb: 2}}
                    />

                    {/* Last Name Field */}
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.last_name}
                        name="last_name"
                        onChange={handleChange}
                        required
                        sx={{mb: 2}}
                    />

                    {/* Update and Cancel Buttons */}
                    <Grid container spacing={2} sx={{mt: 2}}>
                        <Grid item xs={6}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                onClick={onClose}
                                sx={{bgcolor: 'purple', color: 'white'}}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <ModalErrorSnackbar
                    open={snackbarOpen}
                    message={snackbarMessage}
                    onClose={handleSnackbarClose}
                />
            </Paper>
        </Modal>
    );
};

export default ChildEditModal;
