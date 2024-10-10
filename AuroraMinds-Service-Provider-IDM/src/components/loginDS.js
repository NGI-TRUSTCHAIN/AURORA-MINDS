import React from 'react';
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

const LoginDS = () => {
    const history = useHistory();

    const handleUpload = () => {
         let userDataCookie = getCookie('userData');
         if (userDataCookie) {
                // Print the raw cookie data to debug
                console.log('Raw userDataCookie:', userDataCookie);

                try {
                    // Parse the JSON data from the cookie
                    let userData = JSON.parse(userDataCookie);

                    //console.log(userData);

                    // Extract specific fields
                    let name = userData.name;
                    let nickname = userData.nickname;
                    let birthdate = userData.birthdate;
                    let middleName = userData.middle_name;
                    let given_name = userData.given_name;

                swal({
                    title: "Upload Successful",
                    text: "Credential has been uploaded!",
                    icon: "success",
                    button: "Ok",
                }).then(() => {
                    window.location.href = ('/login_DS/verifypresentation');
                });
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
    };

    return (
        <Container style={styles.container}>
            <Typography variant="h4" style={styles.title}>
                Upload Credential
            </Typography>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={styles.button}
                onClick={handleUpload}
            >
                Upload Credential
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

export default LoginDS;
