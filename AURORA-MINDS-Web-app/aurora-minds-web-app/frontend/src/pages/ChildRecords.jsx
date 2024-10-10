import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {deleteParentChild, getChildrenRecords} from '../services/child-api';
import {updateParentId} from '../services/third-party-api';
import QuestionnaireModal from './modals/QuestionnaireModal';
import UserModal from './modals/UserModal';
import CreateChildQuestionnaireAdhdModal from './modals/CreateChildQuestionnaireAdhdModal.jsx';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ChildEditModal from './modals/ChildEditModal';
import {useOutletContext} from 'react-router-dom';

/**
 * Component to display and manage children records.
 */
const ChildRecords = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State for QuestionnaireModal visibility
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false); // State to determine if edit mode is active
    const [alertMessage, setAlertMessage] = useState('');
    const [setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen] = useOutletContext();
    const userRole = localStorage.getItem('user_role');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [childToDelete, setChildToDelete] = useState(null);

    // Fetch children records on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getChildrenRecords(); // Fetch records from API
            setRecords(data); // Set fetched records to state
            setFilteredRecords(data); // Initially set filtered records to all records
        };

        fetchData();
    }, []);

    // Handle page change in pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle change in rows per page in pagination
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle search term change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Filter records based on search term
        const filtered = records.filter(record =>
            `${record.first_name} ${record.last_name}`.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredRecords(filtered);
    };

    // Handle view button click
    const handleView = (child) => {
        setSelectedChild(child);
        setIsEdit(false);
        setIsModalOpen(true);
    };

    // Handle edit button click
    const handleEdit = (child) => {
        setSelectedChild(child);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    // Handle user click in the table
    const handleUserClick = (userId, role) => {
        setSelectedUser({userId, role});
        setIsUserModalOpen(true);
    };

    // Handle create modal open
    const handleCreateModalOpen = () => {
        setIsCreateModalOpen(true);
    };

    // Handle create modal close
    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
    };

    // Handle questionnaire modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedChild(null);
        setAlertMessage('');
    };

    // Handle user modal close
    const handleUserModalClose = () => {
        setIsUserModalOpen(false);
        setSelectedUser(null);
    };

    // Handle child edit modal close
    const handleEditChildModalClose = () => {
        setIsEditChildModalOpen(false);
        setSelectedChild(null);
    };

    // Handle alert close
    const handleAlertClose = () => {
        setAlertMessage('');
    };

    // Handle questionnaire update success
    const handleUpdateSuccess = () => {
        setSnackbarMessage('Questionnaire updated successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleModalClose();
    };

    // Handle questionnaire update failure
    const handleUpdateFailure = (message) => {
        setSnackbarMessage(message || 'Failed to update questionnaire.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    };

    // Handle create success
    const handleCreateSuccess = () => {
        setSnackbarMessage('Child record created successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        handleCreateModalClose();
        // Refresh records
        const fetchData = async () => {
            const data = await getChildrenRecords();
            setRecords(data);
            setFilteredRecords(data);
        };
        fetchData();
    };

    // Handle delete confirmation
    const handleDelete = async () => {
        try {
            // Update parent ID to null before deleting the child record
            await updateParentId({
                child_id: childToDelete.child_id,
                parent_id: null
            });

            // Call delete API
            await deleteParentChild({
                child_id: childToDelete.child_id,
                first_name: childToDelete.first_name,
                last_name: childToDelete.last_name,
                score: childToDelete.score,
                parent_id: childToDelete.parent_id.id,
                clinician_id: childToDelete.clinician_id.id
            });

            setSnackbarMessage('Child record deleted successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setIsDeleteDialogOpen(false); // Close dialog
            setChildToDelete(null);
            // Refresh records
            const fetchData = async () => {
                const data = await getChildrenRecords();
                setRecords(data);
                setFilteredRecords(data);
            };
            fetchData();
        } catch (err) {
            setSnackbarMessage('Failed to delete child record.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setIsDeleteDialogOpen(false); // Close dialog
            setChildToDelete(null);
        }
    };

    // Handle delete button click
    const handleDeleteClick = (child) => {
        setChildToDelete(child);
        setIsDeleteDialogOpen(true);
    };

    // Handle delete dialog close
    const handleDeleteDialogClose = () => {
        setIsDeleteDialogOpen(false);
        setChildToDelete(null);
    };

    // Handle child edit button click
    const handleChildEdit = (child) => {
        setSelectedChild(child);
        setIsEditChildModalOpen(true);
    };

    return (
        <Box sx={{width: '100%'}}>
            {/* Page title */}
            <Typography component="h1" variant="h5">
                Children Records
            </Typography>
            {/* Search field and Add Child button */}
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                    <TextField
                        label="Search by child's fullname"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{width: '50%'}}
                    />
                </Grid>
                {userRole === 'PARENT' && (
                    <Grid item xs={2} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon/>}
                            onClick={handleCreateModalOpen}
                            sx={{mb: 2}}
                        >
                            Add Child
                        </Button>
                    </Grid>
                )}
            </Grid>
            {/* Children records table */}
            <TableContainer component={Paper} sx={{marginTop: 3}}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 'bold'}}>Child ID</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>First Name</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Last Name</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Score</TableCell>
                            {userRole === 'CLINICIAN' &&
                                <TableCell sx={{fontWeight: 'bold'}}>Parent Fullname</TableCell>}
                            {userRole === 'PARENT' &&
                                <TableCell sx={{fontWeight: 'bold'}}>Clinician Fullname</TableCell>}
                            <TableCell sx={{fontWeight: 'bold'}}>Questionnaire</TableCell>
                            {userRole === 'PARENT' && <TableCell sx={{fontWeight: 'bold'}}>Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                            <TableRow key={record.child_id}>
                                <TableCell component="th" scope="row">
                                    {record.child_id}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {record.first_name}
                                </TableCell>
                                <TableCell>{record.last_name}</TableCell>
                                <TableCell>{record.score}</TableCell>
                                {/* Display in column the parent first and last name if user is a clinician */}
                                {userRole === 'CLINICIAN' && (
                                    <TableCell>
                                        {`${record.parent_id.first_name} ${record.parent_id.last_name}`}
                                        <IconButton onClick={() => handleUserClick(record.parent_id.id, 'PARENT')}>
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </TableCell>
                                )}
                                {/* Display in column the clinician first and last name if user is a parent */}
                                {userRole === 'PARENT' && (
                                    <TableCell>
                                        {`${record.clinician_id.first_name} ${record.clinician_id.last_name}`}
                                        <IconButton
                                            onClick={() => handleUserClick(record.clinician_id.id, 'CLINICIAN')}>
                                            <VisibilityIcon/>
                                        </IconButton>
                                    </TableCell>
                                )}
                                <TableCell>
                                    {userRole === 'PARENT' && (
                                        <IconButton onClick={() => handleEdit(record)}>
                                            <EditIcon/>
                                        </IconButton>
                                    )}
                                    <IconButton onClick={() => handleView(record)}>
                                        <VisibilityIcon/>
                                    </IconButton>
                                </TableCell>
                                {userRole === 'PARENT' && (
                                    <TableCell>
                                        <IconButton onClick={() => handleChildEdit(record)}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteClick(record)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination controls */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredRecords.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {/* Modals for viewing and editing questionnaire, viewing user details, and creating child questionnaire */}
            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
            >
                <QuestionnaireModal
                    child={selectedChild}
                    isEdit={isEdit}
                    onClose={handleModalClose}
                    onUpdateSuccess={handleUpdateSuccess}
                    onUpdateFailure={handleUpdateFailure}
                />
            </Modal>
            <Modal
                open={isUserModalOpen}
                onClose={handleUserModalClose}
            >
                <UserModal
                    userId={selectedUser?.userId}
                    role={selectedUser?.role}
                    onClose={handleUserModalClose}
                />
            </Modal>
            <Modal
                open={isCreateModalOpen}
                onClose={handleCreateModalClose}
            >
                <CreateChildQuestionnaireAdhdModal
                    onClose={handleCreateModalClose}
                    onCreateSuccess={handleCreateSuccess}
                />
            </Modal>
            {/* Modal for editing child */}
            <Modal
                open={isEditChildModalOpen}
                onClose={handleEditChildModalClose}
            >
                <ChildEditModal
                    child={selectedChild}
                    onClose={handleEditChildModalClose}
                    onUpdateSuccess={handleCreateSuccess}
                />
            </Modal>
            {/* Dialog for delete confirmation */}
            <Dialog
                open={isDeleteDialogOpen}
                onClose={handleDeleteDialogClose}
            >
                <DialogTitle>Delete Child Record</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this child record?
                    </DialogContentText>
                    <DialogContentText>
                        This will also delete the child's questionnaire.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDelete} variant="contained" color="primary" size="medium">
                        Delete
                    </Button>
                    <Button onClick={handleDeleteDialogClose} variant="contained" color="secondary" size="medium"
                            sx={{bgcolor: 'purple', color: 'white'}}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ChildRecords;
