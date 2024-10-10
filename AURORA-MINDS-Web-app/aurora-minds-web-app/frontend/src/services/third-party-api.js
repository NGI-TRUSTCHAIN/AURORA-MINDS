import axios from 'axios';

/**
 * Creates an axios instance for the third-party API with the base URL
 * and authorization headers set from the environment variables.
 */
const thirdPartyApi = axios.create({
    baseURL: import.meta.env.VITE_THIRD_PARTY_API_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_THIRD_PARTY_API_TOKEN}`
    }
});

/**
 * Function to update the parent ID in the third-party system
 *
 * @param {Object} data - The request data containing child_id and parent_id
 * @returns {Promise<Array>} A promise that resolves to an array of updated ADHD records
 * @throws {Error} Throws an error if the request fails
 */
export const updateParentId = async (data) => {
    try {
        const response = await thirdPartyApi.post('/adhd/update-parent-id', data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error has occurred. Please contact IT Support for help.');
    }
};
