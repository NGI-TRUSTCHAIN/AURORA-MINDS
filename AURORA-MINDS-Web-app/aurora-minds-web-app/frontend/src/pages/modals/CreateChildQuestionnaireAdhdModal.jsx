import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {Close} from '@mui/icons-material';
import {createParentChild} from '../../services/child-api';
import {updateParentId} from '../../services/third-party-api';
import {createAdhdRecord} from '../../services/adhd-api';
import {createQuestionnaire} from "../../services/questionnaire-api.js";
import ModalErrorSnackbar from './ModalErrorSnackbar';

// Component for creating a child record and associated questionnaire
const CreateChildQuestionnaireAdhdModal = ({onClose, onCreateSuccess}) => {
    // Initialize form data state
    const [formData, setFormData] = useState({
        child_id: '',
        first_name: '',
        last_name: '',
        gender: '',
        weight: '',
        height: '',
        date_of_birth: '',
        is_native_greek_language: false,
        place_of_residence: '',
        regional_unit: '',
        school_name: '',
        school_grade: '',
        school_class_section: '',
        has_parent_fully_custody: false,
        comments: '',
        has_hearing_problem: false,
        has_vision_problem: false,
        has_early_learning_difficulties: false,
        has_delayed_development: false,
        has_autism: false,
        has_deprivation_neglect: false,
        has_childhood_aphasia: false,
        has_intellectual_disability: false
    });

    const [loading, setLoading] = useState(false); // Loading state for the submit button
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Handle input change events for form fields
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        try {
            const userId = localStorage.getItem('user_id'); // Retrieve user ID from local storage

            // Step 1: Call third-party API to update parent ID
            const parentIdUpdateData = {
                child_id: formData.child_id,
                parent_id: userId
            };
            const adhdResponses = await updateParentId(parentIdUpdateData);

            // Step 2: Create the child data payload
            const childData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                score: null,
                parent_id: userId,
                clinician_id: adhdResponses[0].clinician_id, // Each child belongs to only one clinician
                child_id: formData.child_id  // Use child_id from the input
            };

            // First API call to create the child
            await createParentChild(childData);

            // Step 3: Create the questionnaire data payload
            const questionnaireData = {
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
                child_id: formData.child_id // Use the child ID from the input
            };

            // Second API call to create the questionnaire
            await createQuestionnaire(questionnaireData);

            // Step 4: Create the ADHD records using the response from the third-party API
            for (const adhdResponse of adhdResponses) {
                const adhdData = {
                    adhd_id: adhdResponse.adhd_id,
                    perception_1: adhdResponse.perception_1,
                    fine_motor: adhdResponse.fine_motor,
                    pre_writing: adhdResponse.pre_writing,
                    visual_motor_integration: adhdResponse.visual_motor_integration,
                    spatial_orientation: adhdResponse.spatial_orientation,
                    perception_2: adhdResponse.perception_2,
                    cognitive_flexibility: adhdResponse.cognitive_flexibility,
                    attention_deficit: adhdResponse.attention_deficit,
                    sustained_attention: adhdResponse.sustained_attention,
                    target: adhdResponse.target,
                    child_id: adhdResponse.child_id
                };
                await createAdhdRecord(adhdData);
            }

            onCreateSuccess();
        } catch (err) {
            console.error('Failed to create child record', err);
            setSnackbarMessage(err.detail || err.message);
            setSnackbarOpen(true);
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

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
                Create Child Record
            </Typography>

            {/* Form for creating child record and questionnaire */}
            <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                <Grid container spacing={2}>
                    {/* Child ID Field */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Child ID"
                            value={formData.child_id}
                            name="child_id"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    {/* Warning box */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{
                            backgroundColor: 'rgba(255, 215, 0, 0.1)', // Light golden color
                            borderRadius: 1,
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for a more professional look
                            p: 2,
                            backdropFilter: 'blur(10px)', // Blur effect
                            border: '1px solid rgba(255, 215, 0, 0.3)' // Border color to enhance the golden look
                        }}>
                            <Typography variant="body2" sx={{fontWeight: 'bold', color: '#8B8000'}}>
                                Your clinician should provide you with the Child ID. If the correct Child ID is entered,
                                your child's ADHD record(s) will be added to your account's 'ADHD Records' section as
                                well.
                                <br/>
                                Otherwise, the request will fail, and the child's record will not be created at all.
                            </Typography>
                        </Box>
                    </Grid>
                    {/* Child information fields */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={formData.first_name}
                            name="first_name"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={formData.last_name}
                            name="last_name"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/* Divider line between child info and questionnaire fields */}
                        <Divider sx={{width: '100%', my: 2, borderBottomWidth: '2px', borderColor: 'black'}}/>
                    </Grid>

                    {/* Questionnaire fields */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Gender"
                            value={formData.gender}
                            name="gender"
                            onChange={handleChange}
                            required
                        >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Weight"
                            value={formData.weight}
                            name="weight"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Height"
                            value={formData.height}
                            name="height"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
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
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.is_native_greek_language}
                                    onChange={handleChange}
                                    name="is_native_greek_language"
                                />
                            }
                            label="Is Greek language child's mother tongue?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Place of Residence"
                            value={formData.place_of_residence}
                            name="place_of_residence"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Regional Unit"
                            value={formData.regional_unit}
                            name="regional_unit"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="School Name"
                            value={formData.school_name}
                            name="school_name"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="School Grade"
                            value={formData.school_grade}
                            name="school_grade"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="School Class Section"
                            value={formData.school_class_section}
                            name="school_class_section"
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_parent_fully_custody}
                                    onChange={handleChange}
                                    name="has_parent_fully_custody"
                                />
                            }
                            label="The parent (you) has full custody and custody of the child"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Comments"
                            value={formData.comments}
                            name="comments"
                            onChange={handleChange}
                            multiline
                            rows={2} // Adjust the number of rows as needed to increase height
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            <u>Is there a diagnosis for any of the following disorders?</u>
                        </Typography>
                    </Grid>

                    {/* Disorder checkboxes */}
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_hearing_problem}
                                    onChange={handleChange}
                                    name="has_hearing_problem"
                                />
                            }
                            label="Has Hearing Problem?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_vision_problem}
                                    onChange={handleChange}
                                    name="has_vision_problem"
                                />
                            }
                            label="Has Vision Problem?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_early_learning_difficulties}
                                    onChange={handleChange}
                                    name="has_early_learning_difficulties"
                                />
                            }
                            label="Has Early Learning Difficulties?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_delayed_development}
                                    onChange={handleChange}
                                    name="has_delayed_development"
                                />
                            }
                            label="Has Delayed Development?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_autism}
                                    onChange={handleChange}
                                    name="has_autism"
                                />
                            }
                            label="Has Autism?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_deprivation_neglect}
                                    onChange={handleChange}
                                    name="has_deprivation_neglect"
                                />
                            }
                            label="Has Deprivation Neglect?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_childhood_aphasia}
                                    onChange={handleChange}
                                    name="has_childhood_aphasia"
                                />
                            }
                            label="Has Childhood Aphasia?"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.has_intellectual_disability}
                                    onChange={handleChange}
                                    name="has_intellectual_disability"
                                />
                            }
                            label="Has Intellectual Disability?"
                        />
                    </Grid>
                </Grid>

                {/* Buttons for creating or cancelling */}
                <Grid container spacing={2} sx={{mt: 3, justifyContent: 'center'}}>
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="medium"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : 'Create'}
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
            </Box>
            <ModalErrorSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={handleSnackbarClose}
            />
        </Paper>
    );
};

export default CreateChildQuestionnaireAdhdModal;
