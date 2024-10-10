import api from './api';

/**
 * Fetch ADHD records from the server.
 *
 * This function sends a GET request to the '/users/adhd-records' endpoint
 * to retrieve a list of ADHD records. It uses the Axios instance configured
 * in the 'api' module, which includes the base URL and any necessary
 * authentication headers.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of ADHD records.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const getAdhdRecords = async () => {
    try {
        // Send GET request to fetch ADHD records
        const response = await api.get('/users/adhd-records');

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to retrieve ADHD records');
    }
};

/**
 * Create a new ADHD record on the server.
 *
 * This function sends a POST request to the '/adhd/create' endpoint
 * to create a new ADHD record with the provided data. It uses the Axios instance
 * configured in the 'api' module, which includes the base URL and any necessary
 * authentication headers.
 *
 * @param {Object} data - The data for the new ADHD record.
 * @param {number} data.adhd_id - The unique identifier for the ADHD record.
 * @param {number} data.perception_1 - The score for perception 1.
 * @param {number} data.fine_motor - The score for fine motor skills.
 * @param {number} data.pre_writing - The score for pre-writing skills.
 * @param {number} data.visual_motor_integration - The score for visual-motor integration.
 * @param {number} data.spatial_orientation - The score for spatial orientation.
 * @param {number} data.perception_2 - The score for perception 2.
 * @param {number} data.cognitive_flexibility - The score for cognitive flexibility.
 * @param {number} data.attention_deficit - The score for attention deficit.
 * @param {number} data.sustained_attention - The score for sustained attention.
 * @param {number} data.target - The target score.
 * @param {number} data.child_id - The identifier of the associated child.
 * @returns {Promise<Object>} A promise that resolves to the newly created ADHD record.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const createAdhdRecord = async (data) => {
    try {
        // Send POST request to create a new ADHD record
        const response = await api.post('/adhd/create', data);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to update child\'s ADHD record(s)');
    }
};
