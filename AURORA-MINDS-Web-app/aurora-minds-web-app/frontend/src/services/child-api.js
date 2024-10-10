import api from './api';

/**
 * Fetch children records from the server.
 *
 * This function sends a GET request to the '/users/children-records' endpoint
 * to retrieve a list of children records. It uses the Axios instance configured
 * in the 'api' module, which includes the base URL and any necessary
 * authentication headers.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of children records.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const getChildrenRecords = async () => {
    try {
        // Send GET request to fetch children records
        const response = await api.get('/users/children-records');

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to retrieve child\'s record');
    }
};

/**
 * Create a new child record for a parent.
 *
 * This function sends a POST request to the '/users/create-parent-child' endpoint
 * to create a new child record. The child data is passed as a parameter to this function
 * and included in the request body.
 *
 * @param {Object} childData - The data of the child to be created.
 * @returns {Promise<Object>} A promise that resolves to the created child record data.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const createParentChild = async (childData) => {
    try {
        // Send POST request to create a new child record
        const response = await api.post('/users/create-parent-child', childData);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to create child\'s record');
    }
};

/**
 * Update a parent child record.
 *
 * This function sends a POST request to the '/users/update-parent-child' endpoint
 * to update a child's record. It uses the Axios instance configured in the 'api' module,
 * which includes the base URL and any necessary authentication headers.
 *
 * @param {Object} data - The data for updating the child record.
 * @returns {Promise<Object>} A promise that resolves to the updated child record.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const updateParentChild = async (data) => {
    try {
        // Send POST request to update the child record
        const response = await api.post('/users/update-parent-child', data);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to update child\'s record');
    }
};

/**
 * Delete a child record for a parent.
 *
 * This function sends a POST request to the '/users/delete-parent-child' endpoint
 * to delete a child record. The child data is passed as a parameter to this function
 * and included in the request body.
 *
 * @param {Object} childData - The data of the child to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response data.
 * @throws {Error} Throws an error if the request fails, with a message indicating the failure.
 */
export const deleteParentChild = async (childData) => {
    try {
        // Send POST request to delete a child record
        const response = await api.post('/users/delete-parent-child', childData);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to delete child\'s record');
    }
};
