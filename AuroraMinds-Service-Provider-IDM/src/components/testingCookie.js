import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import { Container, Button } from "@material-ui/core";

const testingCookie = () => {


window.addEventListener('message', (event) => {

    //page will listen to messages, logic before -- if event.origin -- works regardless of whether the origin of the message is trusted or not.

    //console.log('Message received from origin:', event.origin);

    //You will add our domain (port if needed) when finalised, at the moment we send from http://localhost:3000, in order to verify message was sent from Aurora Minds Verifier
    if (event.origin === 'http://localhost:3000')
    {
            console.log('Verified message data:', event.data);
            //Code for the message received should be added here meaning it will run only from the trusted source
            const { userData } = event.data;

                    if (userData) {
                        try {
                            // Message is sent in JSON format
                            // Parse the JSON string
                             const parsedUserData = typeof userData === 'string' ? JSON.parse(userData) : userData;

                             // Set the parsed data as a cookie named userData
                             // Commented line below stores the userData cookie in a URL Encoded format, use the one needed
                             //document.cookie = `userData=${encodeURIComponent(JSON.stringify(parsedUserData))}; path=/`;
                             document.cookie = 'userData=' + JSON.stringify(parsedUserData) + ';path=/';


                             const cookieValue = getCookie('userData');
                             //console.log('userData Cookie:', cookieValue);
                        } catch (error) {
                            console.error('Error parsing userData:', error);
                        }
                    }
    }
    else
    {
            console.warn('Message from untrusted origin:', event.origin);
    }
    })

    // Function to get a specific cookie by name (userData)
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(';').shift());
        }
        return null;
    }

}

export default testingCookie;