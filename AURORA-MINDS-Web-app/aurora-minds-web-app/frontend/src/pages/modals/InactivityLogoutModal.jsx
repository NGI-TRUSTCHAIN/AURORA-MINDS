import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Modal component to display inactivity logout warning
const InactivityLogoutModal = ({open, onClose}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {/* Dialog title with warning icon and text */}
            <DialogTitle id="alert-dialog-title">
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <WarningAmberIcon sx={{color: '#FFD700', fontSize: 40, mr: 1}}/>
                    <Typography variant="h6">Inactivity Warning</Typography>
                </Box>
            </DialogTitle>

            {/* Dialog content with warning message */}
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You have been logged out due to inactivity.
                </DialogContentText>
            </DialogContent>

            {/* Dialog actions with centered OK button */}
            <DialogActions sx={{justifyContent: 'center'}}>
                <Button onClick={onClose} color="primary" variant="contained">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InactivityLogoutModal;
