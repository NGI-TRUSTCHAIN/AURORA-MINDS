import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../services/api.js";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../utils/constants";
import React, {useEffect, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import Typography from "@mui/material/Typography";

/**
 * This is a (CUSTOM) wrapper for a protected route.
 * The idea is if we wrap something in protected route then we need to have an
 * authorization token before be able to actually access this route.
 */


/**
 * ProtectedRoute component is a wrapper for protected routes  (authorize before access this route).
 * It ensures that the user is authorized before allowing access to the route.
 * If the user is not authorized, they are redirected to the login page.
 *
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.children - The child components to render if authorized.
 * @returns {JSX.Element} - The rendered component.
 */
function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    /**
     * useEffect hook to initiate the authorization check when the component mounts.
     */
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    /**
     * refreshToken function requests a new access token using the refresh token.
     * If successful, it updates the access token in localStorage and sets authorization to true.
     * If unsuccessful, it sets authorization to false.
     */
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/token/refresh/", {
                refresh: refreshToken,
            });
            // Get the new access token from the refresh token
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    /**
     * auth function checks if there is a valid access token.
     * If the token is expired, it attempts to refresh it.
     * Otherwise, it sets authorization to true, navigating the user to the login page eventually.
     */
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        // If not have the token, decode the token and get the expiration date
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;  // date in seconds (instead of ms)
        // Based on expiration date, if the token is expired, refresh it
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);  // token is still valid/NOT expired
        }
    };

    if (isAuthorized === null) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress/>
                <Typography variant="h6" sx={{mt: 2}}>Loading...</Typography>
            </Box>
        ); // while checking the token (until useState != null)
    }

    return isAuthorized ? children : <Navigate to="/login"/>;
}

export default ProtectedRoute;