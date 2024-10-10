import api from './api';

/**
 * Fetch the questionnaire for a specific child.
 *
 * This function sends a POST request to the '/users/get-questionnaire' endpoint
 * with the child data to retrieve the associated questionnaire.
 *
 * @param {Object} child - The data of the child for whom the questionnaire is to be fetched.
 * @returns {Promise<Object>} A promise that resolves to the questionnaire data.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const getQuestionnaire = async (child) => {
    try {
        // Send POST request to fetch the questionnaire for the given child
        const response = await api.post('/users/get-questionnaire', child);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to retrieve child\'s questionnaire');
    }
};

/**
 * Create a new questionnaire for a child.
 *
 * This function sends a POST request to the '/users/create-questionnaire' endpoint
 * with the questionnaire data to create a new questionnaire record.
 *
 * @param {Object} questionnaireData - The data of the questionnaire to be created.
 * @returns {Promise<Object>} A promise that resolves to the created questionnaire data.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const createQuestionnaire = async (questionnaireData) => {
    try {
        // Send POST request to create a new questionnaire
        const response = await api.post('/users/create-questionnaire', questionnaireData);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to create child\'s questionnaire');
    }
};

/**
 * Update an existing questionnaire.
 *
 * This function sends a POST request to the '/users/update-questionnaire' endpoint
 * with the updated questionnaire data.
 *
 * @param {Object} formData - The data of the questionnaire to be updated.
 * @returns {Promise<Object>} A promise that resolves to the updated questionnaire data.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const updateQuestionnaire = async (formData) => {
    try {
        // Send POST request to update an existing questionnaire
        const response = await api.post('/users/update-questionnaire', formData);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to update child\'s questionnaire');
    }
};
