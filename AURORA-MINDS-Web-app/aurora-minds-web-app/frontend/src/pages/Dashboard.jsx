import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InactivityLogoutModal from './modals/InactivityLogoutModal';

const drawerWidth = 240;

const Alert = React.forwardRef((props, ref) => {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Dashboard() {
    const [anchorEl, setAnchorEl] = React.useState(null); // State for account menu anchor element
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [inactivityModalOpen, setInactivityModalOpen] = React.useState(false);
    const navigate = useNavigate();

    // Function to handle account menu open
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Function to handle account menu close
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Function to handle user logout
    const handleLogout = () => {
        handleClose();
        navigate('/logout');
    };

    // Function to handle snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // Effect to handle inactivity logout
    React.useEffect(() => {
        let timer;
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                setInactivityModalOpen(true);
            }, 30 * 60 * 1000); // 30 minutes inactivity
        };

        const handleActivity = () => {
            resetTimer();
        };

        // Add event listeners for user activity
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        resetTimer();

        // Cleanup event listeners on component unmount
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
        };
    }, []);

    // Function to handle inactivity logout
    const handleInactivityLogout = () => {
        setInactivityModalOpen(false);
        navigate('/logout');
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            {/* AppBar at the top of the page */}
            <AppBar
                position="fixed"
                sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`}}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
                        Aurora-Minds Dashboard
                    </Typography>
                    <div>
                        {/* Account Icon Button */}
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        {/* Account Menu */}
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            {/* Drawer on the left side */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar/>
                <Divider/>
                <List>
                    <ListItem button component={Link} to="/">
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Home"/>
                    </ListItem>
                    <Divider/>
                    <ListItem button component={Link} to="child-records">
                        <ListItemIcon>
                            <FamilyRestroomIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Children records"/>
                    </ListItem>
                    <Divider/>
                    <ListItem button component={Link} to="adhd-records">
                        <ListItemIcon>
                            <AssignmentIcon/>
                        </ListItemIcon>
                        <ListItemText primary="ADHD Records"/>
                    </ListItem>
                    <Divider/>
                </List>
            </Drawer>
            {/* Main content area */}
            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default', p: 3}}
            >
                <Toolbar/>
                {/* Outlet for nested routes */}
                <Outlet context={[setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen]}/>
            </Box>
            {/* Snackbar for notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* Inactivity logout modal */}
            <InactivityLogoutModal
                open={inactivityModalOpen}
                onClose={handleInactivityLogout}
            />
        </Box>
    );
}

export default Dashboard;
