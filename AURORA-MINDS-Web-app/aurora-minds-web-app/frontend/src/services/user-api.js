import api from './api.js';

/**
 * Fetches a user by their role by sending a POST request with user ID and role.
 *
 * @param {number} userId - The ID of the user to be fetched.
 * @param {string} role - The role of the user to be fetched.
 * @returns {Promise<Object>} - The response data containing user details.
 * @throws {Object|Error} - Throws an error if the request fails.
 */
export const getUserByRole = async (userId, role) => {
    try {
        // Send a POST request to fetch user details by role
        const response = await api.post('/users/get-user-by-role/', {user_id: userId, role});

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('An error has occurred. Please contact IT Support for help');
    }
};

/**
 * Fetches a list of users by their role by sending a POST request with the role.
 *
 * @param {string} role - The role of the users to be fetched.
 * @returns {Promise<Object[]>} - The response data containing a list of users.
 * @throws {Object|Error} - Throws an error if the request fails.
 */
export const getUsersByRole = async (role) => {
    try {
        // Send a POST request to fetch a list of users by role
        const response = await api.post('users/list-users-by-role', {role});

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('An error has occurred. Please contact IT Support for help');
    }
};
