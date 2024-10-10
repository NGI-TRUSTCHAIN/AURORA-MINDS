import React, {useEffect, useState} from 'react';
import {
    Box,
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
import {getAdhdRecords} from '../services/adhd-api';

/**
 * Component to display and manage ADHD records.
 */
const AdhdRecords = () => {
    const [records, setRecords] = useState([]); // State to hold all records
    const [filteredRecords, setFilteredRecords] = useState([]); // State to hold filtered records
    const [page, setPage] = useState(0); // State for pagination current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // State for pagination rows per page
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    // Fetch ADHD records on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAdhdRecords(); // Fetch records from API
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
            `${record.child_id.first_name} ${record.child_id.last_name}`.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setFilteredRecords(filtered);
    };

    return (
        <Box sx={{width: '100%'}}>
            {/* Page title */}
            <Typography component="h1" variant="h5">
                ADHD Records
            </Typography>
            {/* Search field */}
            <TextField
                label="Search by child's fullname"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{width: '41.55%'}}
            />
            {/* Table container */}
            <TableContainer component={Paper} sx={{marginTop: 3}}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    {/* Table head */}
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 'bold'}}>ADHD ID</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Child Fullname</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Perception 1</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Fine Motor</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Pre Writing</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Visual Motor Integration</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Spatial Orientation</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Perception 2</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Cognitive Flexibility</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Attention Deficit</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Sustained Attention</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Target</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Table body */}
                    <TableBody>
                        {filteredRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                            <TableRow key={record.adhd_id}>
                                <TableCell>{record.adhd_id}</TableCell>
                                <TableCell>{`${record.child_id.first_name} ${record.child_id.last_name}`}</TableCell>
                                <TableCell>{record.perception_1}</TableCell>
                                <TableCell>{record.fine_motor}</TableCell>
                                <TableCell>{record.pre_writing}</TableCell>
                                <TableCell>{record.visual_motor_integration}</TableCell>
                                <TableCell>{record.spatial_orientation}</TableCell>
                                <TableCell>{record.perception_2}</TableCell>
                                <TableCell>{record.cognitive_flexibility}</TableCell>
                                <TableCell>{record.attention_deficit}</TableCell>
                                <TableCell>{record.sustained_attention}</TableCell>
                                <TableCell>{record.target}</TableCell>
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
        </Box>
    );
};

export default AdhdRecords;
