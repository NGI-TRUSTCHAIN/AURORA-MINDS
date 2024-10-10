import axios from 'axios';

/**
 * Creates an Axios instance with a base URL.
 * The base URL is retrieved from environment variables.
 */
const loginRegisterApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


/**
 * Authenticates the user by sending a POST request with email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The response data from the login request.
 * @throws {Object|Error} - Throws an error if the login request fails.
 */
export const login = async (email, password) => {
    try {
        // Send a POST request to authenticate the user
        const response = await loginRegisterApi.post('users/login/', {email, password});

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Login failed. Please contact IT Support for help');
    }
};

/**
 * Registers a new user by sending a POST request with the user's data.
 *
 * @param {Object} userData - The data of the user to be registered.
 * @returns {Promise<Object>} - The response data from the registration request.
 * @throws {Object|Error} - Throws an error if the registration request fails.
 */
export const registerUser = async (userData) => {
    try {
        // Send a POST request to register a new user
        const response = await loginRegisterApi.post('users/register/', userData);

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Failed to register. Please contact IT Support for help');
    }
};

/**
 * Function to retrieve a cookie value by its name.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} - The value of the cookie if found, otherwise null.
 */
function getCookie(name) {
    // Get all cookies from the document as a single string and split it into an array of individual cookies
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        // Split each cookie into a name-value pair
        let cookiePair = cookieArr[i].split("=");

        // Remove leading spaces from the cookie name and compare it with the provided name
        if (name === cookiePair[0].trim()) {
            // Decode the cookie value and return it
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if the cookie with the given name is not found
    return null;
}

/**
 * Authenticates the user via cookie by sending a POST request.
 *
 * @returns {Promise<Object>} - The response data from the cookie authentication request.
 * @throws {Object|Error} - Throws an error if the authentication request fails.
 */
export const authenticateWithCookie = async () => {
    try {
        const cookie = getCookie('userData');
        // Send a POST request to authenticate the user via cookie
        const response = await loginRegisterApi.post('cookie-auth/authenticate/', {cookie});

        // Return the data from the response
        return response.data;
    } catch (error) {
        // If an error response is received, throw the error data; otherwise, throw a generic error
        throw error.response ? error.response.data : new Error('Login failed. Please contact IT Support for help');
    }
};
