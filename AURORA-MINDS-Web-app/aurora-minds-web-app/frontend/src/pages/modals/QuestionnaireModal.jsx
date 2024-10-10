import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {Close} from '@mui/icons-material';
import {getQuestionnaire, updateQuestionnaire} from '../../services/questionnaire-api.js';
import ModalErrorSnackbar from './ModalErrorSnackbar';

// Modal component for displaying and editing a child's questionnaire
const QuestionnaireModal = ({child, isEdit, onClose, onUpdateSuccess, onUpdateFailure}) => {
    const [questionnaire, setQuestionnaire] = useState(null);
    const [formData, setFormData] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch questionnaire data when the child prop changes
    useEffect(() => {
        if (child) {
            const fetchQuestionnaire = async () => {
                const data = await getQuestionnaire({
                    first_name: child.first_name,
                    last_name: child.last_name,
                    score: child.score,
                    parent_id: child.parent_id.id, // Extracting id from parent_id object
                    clinician_id: child.clinician_id.id, // Extracting id from clinician_id object
                    child_id: child.child_id
                });
                data.first_name = child.first_name;
                data.last_name = child.last_name;
                data.child_id = child.child_id; // Ensure child_id is included in the formData
                setQuestionnaire(data);
                setFormData(data);
            };
            fetchQuestionnaire();
        }
    }, [child]);

    // Handle input changes in the form
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission to update questionnaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                questionnaire_id: formData.questionnaire_id,
                gender: formData.gender,
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                date_of_birth: formData.date_of_birth,
                is_native_greek_language: formData.is_native_greek_language,
                place_of_residence: formData.place_of_residence,
                regional_unit: formData.regional_unit,
                school_name: formData.school_name,
                school_grade: formData.school_grade,
                school_class_section: formData.school_class_section,
                has_parent_fully_custody: formData.has_parent_fully_custody,
                comments: formData.comments,
                has_hearing_problem: formData.has_hearing_problem,
                has_vision_problem: formData.has_vision_problem,
                has_early_learning_difficulties: formData.has_early_learning_difficulties,
                has_delayed_development: formData.has_delayed_development,
                has_autism: formData.has_autism,
                has_deprivation_neglect: formData.has_deprivation_neglect,
                has_childhood_aphasia: formData.has_childhood_aphasia,
                has_intellectual_disability: formData.has_intellectual_disability,
                child_id: formData.child_id
            };
            await updateQuestionnaire(updateData);
            onUpdateSuccess();
        } catch (err) {
            console.error('Failed to update questionnaire', err);
            setSnackbarMessage(err.message || 'Failed to update questionnaire');
            setSnackbarOpen(true);
            onUpdateFailure(err.message);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    if (!questionnaire) {
        return null;  // If questionnaire data is not available, return null
    }

    return (
        <Paper sx={{
            p: 4,
            margin: 'auto',
            maxWidth: '90%',
            flexGrow: 1,
            overflow: 'auto',
            height: '100vh',
            position: 'relative'
        }}>
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
                {isEdit ? 'Edit Questionnaire' : 'Child Questionnaire (Read-only)'}
            </Typography>
            {/* Form for editing or viewing the questionnaire */}
            <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                <Grid container spacing={2}>
                    {/* First Name Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.first_name}
                            name="first_name"
                            onChange={handleChange}
                            InputProps={{readOnly: true, style: isEdit ? {color: 'grey'} : {}}}
                        />
                    </Grid>
                    {/* Last Name Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.last_name}
                            name="last_name"
                            onChange={handleChange}
                            InputProps={{readOnly: true, style: isEdit ? {color: 'grey'} : {}}}
                        />
                    </Grid>
                    {/* Gender Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Gender"
                            value={formData.gender}
                            name="gender"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </TextField>
                    </Grid>
                    {/* Weight Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Weight"
                            value={formData.weight}
                            name="weight"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* Height Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Height"
                            value={formData.height}
                            name="height"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* Date of Birth Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Birth"
                            value={formData.date_of_birth}
                            name="date_of_birth"
                            type="date"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* Greek Language Checkbox */}
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.is_native_greek_language}
                                    onChange={handleChange}
                                    name="is_native_greek_language"
                                    disabled={!isEdit}
                                />
                            }
                            label="Is Greek language child's mother tongue?"
                        />
                    </Grid>
                    {/* Place of Residence Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Place of Residence"
                            value={formData.place_of_residence}
                            name="place_of_residence"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* Regional Unit Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Regional Unit"
                            value={formData.regional_unit}
                            name="regional_unit"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* School Name Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="School Name"
                            value={formData.school_name}
                            name="school_name"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* School Grade Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="School Grade"
                            value={formData.school_grade}
                            name="school_grade"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* School Class Section Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="School Class Section"
                            value={formData.school_class_section}
                            name="school_class_section"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                        />
                    </Grid>
                    {/* Parent Full Custody Checkbox */}
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_parent_fully_custody}
                                    onChange={handleChange}
                                    name="has_parent_fully_custody"
                                    disabled={!isEdit}
                                />
                            }
                            label="The parent (you) has full the custody of the child"
                        />
                    </Grid>
                    {/* Comments Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Comments"
                            value={formData.comments}
                            name="comments"
                            onChange={handleChange}
                            InputProps={{readOnly: !isEdit}}
                            multiline
                            rows={2} // Adjust the number of rows as needed to increase height
                        />
                    </Grid>
                    {/* Diagnosis Title */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            <u>Is there a diagnosis for any of the following disorders?</u>
                        </Typography>
                    </Grid>
                    {/* Hearing Problem Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_hearing_problem}
                                    onChange={handleChange}
                                    name="has_hearing_problem"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Hearing Problem?"
                        />
                    </Grid>
                    {/* Vision Problem Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_vision_problem}
                                    onChange={handleChange}
                                    name="has_vision_problem"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Vision Problem?"
                        />
                    </Grid>
                    {/* Early Learning Difficulties Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_early_learning_difficulties}
                                    onChange={handleChange}
                                    name="has_early_learning_difficulties"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Early Learning Difficulties?"
                        />
                    </Grid>
                    {/* Delayed Development Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_delayed_development}
                                    onChange={handleChange}
                                    name="has_delayed_development"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Delayed Development?"
                        />
                    </Grid>
                    {/* Autism Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_autism}
                                    onChange={handleChange}
                                    name="has_autism"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Autism?"
                        />
                    </Grid>
                    {/* Deprivation Neglect Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_deprivation_neglect}
                                    onChange={handleChange}
                                    name="has_deprivation_neglect"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Deprivation Neglect?"
                        />
                    </Grid>
                    {/* Childhood Aphasia Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_childhood_aphasia}
                                    onChange={handleChange}
                                    name="has_childhood_aphasia"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Childhood Aphasia?"
                        />
                    </Grid>
                    {/* Intellectual Disability Checkbox */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_intellectual_disability}
                                    onChange={handleChange}
                                    name="has_intellectual_disability"
                                    disabled={!isEdit}
                                />
                            }
                            label="Has Intellectual Disability?"
                        />
                    </Grid>
                </Grid>
                {/* Render update and cancel buttons only if isEdit is true */}
                {isEdit && (
                    <Grid container spacing={2} sx={{mt: 3, justifyContent: 'center'}}>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="medium"
                            >
                                Update
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="medium"
                                onClick={onClose}
                                sx={{bgcolor: 'purple', color: 'white'}}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Box>
            <ModalErrorSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={handleSnackbarClose}
            />
        </Paper>
    );
};

export default QuestionnaireModal;
