import {Navigate} from "react-router-dom";
import Register from "../pages/Register.jsx";

/**
 * Logout component clears the local storage (removing access and refresh tokens)
 * and redirects the user to the login page.
 *
 * @returns {JSX.Element} - The Navigate component to redirect to the login page.
 */
function Logout() {
    localStorage.clear();  // clear access and refresh token
    return <Navigate to="/login"/>;
}

/**
 * RegisterAndLogout component clears the local storage (removing any old tokens)
 * and renders the Register component.
 *
 * @returns {JSX.Element} - The Register component.
 */
function RegisterAndLogout() {
    localStorage.clear();  // just in case old token from different accounts kept
    return <Register/>;
}

const RegisterLogout = {
    Logout,
    RegisterAndLogout
};

export default RegisterLogout;
