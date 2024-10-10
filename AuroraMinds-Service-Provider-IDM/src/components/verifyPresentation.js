import React, { useEffect, useState } from 'react';
import { Container, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';

function getCookie(name) {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        // Remove leading spaces and compare cookie name
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

const VerifyPresentation = () => {
    const history = useHistory();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        let userDataCookie = getCookie('userData');
        if (userDataCookie) {
            // Print the raw cookie data to debug
            console.log('Raw userDataCookie:', userDataCookie);

            try {
                // Parse the JSON data from the cookie
                const parsedData = JSON.parse(userDataCookie);

                // Extract specific fields and construct the userData object
                const userData = {
                    name: parsedData.name,
                    birthdate: parsedData.birthdate,
                    nickname: parsedData.nickname,
                    middle_name: parsedData.middle_name,
                    given_name: parsedData.given_name,
                };

                console.log('Formatted userData:', userData);
                setUserData(userData);

            } catch (e) {
                console.error('Error parsing JSON from cookie:', e);
                swal({
                    title: "Upload Failed",
                    text: "Error parsing user data from cookie",
                    icon: "error",
                    button: "Ok",
                });
            }
        } else {
            swal({
                title: "No Credential Found",
                text: "No user data cookie found",
                icon: "error",
                button: "Ok",
            });
        }
    }, [history]);

    const handleExportPolicy = () => {
        if (userData) {
            const predicates = [
                { Full_Name: userData.name, attribute: "name" },
                { Birthdate: userData.birthdate, attribute: "birthdate" },
                { Clinician_Id: userData.nickname, attribute: "nickname" },
                { Email: userData.middle_name, attribute: "middle_name" },
                { Role: userData.given_name, attribute: "preferred_username" },
            ];

            document.cookie = 'predicates=' + JSON.stringify(predicates) + ';path=/';

            swal({
                title: "Policy Exported",
                text: "Policy has been exported to cookie!",
                icon: "success",
                button: "Ok",
            });
        } else {
            swal({
                title: "No User Data",
                text: "No user data available to export policy",
                icon: "error",
                button: "Ok",
            });
        }
    };

    return (
        <Container style={styles.container}>
            <Typography variant="h4" style={styles.title}>
                Verify Presentation
            </Typography>
            <Button variant="contained" color="primary" style={styles.button} onClick={handleExportPolicy}>
                Export Policy
            </Button>
        </Container>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #33a7c4, #74bfc4)',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    },
    title: {
        marginBottom: '20px',
        color: '#fff',
    },
    button: {
        padding: '10px 0',
    },
};

export default VerifyPresentation;
