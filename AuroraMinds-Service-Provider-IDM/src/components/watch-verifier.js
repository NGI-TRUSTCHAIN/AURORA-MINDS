import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import { Button, Container, Switch } from "@material-ui/core";
import { userManager, userManagerOlympus } from "../utils/userManager";
import swal from 'sweetalert';
import { connect } from "react-redux";

const Watch = ({ user }) => {
    const [details, setDetails] = useState({
        "Full Name": '',
        "Birthdate": '',
        "User ID": '',
        "Email": '',
        "Role": '',
    });

    const [revealDetails, setRevealDetails] = useState({
        "Full Name": true,
        "Birthdate": true,
        "User ID": true,
        "Email": true,
        "Role": true,
    });

    useEffect(() => {
        if (user && user.profile) {
            setDetails({
                "Full Name": user.profile.name || '',
                "Birthdate": user.profile.birthdate || '',
                "User ID": user.profile.nickname || '',
                "Email": user.profile.middle_name || '',
                "Role": user.profile.given_name || '',
            });
        }
    }, [user]);

    const handleToggleReveal = (field) => {
        setRevealDetails((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const canUserContinue = () => {
        const atLeastOneFieldRevealed = Object.values(revealDetails).some((value) => value === true);
        const isRole = details["Role"] === "Clinician" || details["Role"] === "Parent";
        return atLeastOneFieldRevealed && isRole;
    };

    const handleContinueClick = () => {
        userManager.getUser();
        userManagerOlympus.storeUser();

        console.log("***", userManager.getUser());

        const canContinue = canUserContinue();

        if (canContinue) {
            const predicates = [
                { Full_Name: user.profile.name, revealed: revealDetails["Full Name"], attribute: "name" },
                { Birthdate: user.profile.birthdate, revealed: revealDetails["Birthdate"], attribute: "birthdate" },
                { Clinician_Id: user.profile.nickname, revealed: revealDetails["User ID"], attribute: "nickname" },
                { Email: user.profile.middle_name, revealed: revealDetails["Email"], attribute: "middle_name" },
                { Role: user.profile.given_name, revealed: revealDetails["Role"], attribute: "given_name" },
            ].filter(predicate => predicate.revealed);

            document.cookie = 'predicates=' + JSON.stringify(predicates) + ';path=/';

            const revealedInfo = Object.entries(revealDetails)
                .filter(([field, value]) => value)
                .map(([field, value]) => field)
                .join(', ');

            const hiddenInfo = Object.entries(revealDetails)
                .filter(([field, value]) => !value)
                .map(([field, value]) => field)
                .join(', ');

            swal({
                title: "Information",
                text: `Revealed: ${revealedInfo}\nHidden: ${hiddenInfo}`,
                icon: "info",
                button: "Ok",
            }).then(() => {
                swal({
                    title: "Aurora Minds",
                    text: "You are Verified!!",
                    icon: "success",
                    button: "Ok",
                }).then(() => {
                    //window.location.href = "http://localhost:8080/verify1";
                    //window.location.href = "https://aurora.dotsoft.gr/login";

                    //console.log('Cookie value:', getCookie('userData'));
//                    let pageBWindow = window.open('http://localhost:3000/testing');
//                    pageBWindow.onload = () => {
//                        pageBWindow.postMessage({ userData: getCookie('userData') }, 'http://localhost:3000');

//                    let pageBWindow = window.open('https://aurora.dotsoft.gr/login');
//                    pageBWindow.onload = () => {
//                    //setTimeout(() => {  }, 1000);
//                    pageBWindow.postMessage({ userData: getCookie('userData') }, 'https://aurora.dotsoft.gr');
//                    };

                    const pageBWindow = window.open('https://aurora.dotsoft.gr/login');

                    // Listen for messages from the new window
                    window.addEventListener('message', (event) => {
                        if (event.origin === 'https://aurora.dotsoft.gr' && event.data.type === 'READY') {
                            // Send the userData via postMessage
                            try {
                                pageBWindow.postMessage({ userData: getCookie('userData') }, 'https://aurora.dotsoft.gr');
                                console.log('Message sent to window');
                            } catch (error) {
                                console.error('Error sending message:', error);
                            }
                        }
                    });
                    });
            });
        } else {
            swal({
                title: "Details Not Revealed or Invalid Specialty",
                text: "Please select at least one detail to reveal the information.",
                icon: "warning",
                button: "Ok",
            }).then(() => {
                userManagerOlympus.signoutRedirect();
            });
        }
    };

    return (
        <Typography variant="subtitle1" align="center">
            <img src="/university.png" width="250" height="160" alt="Logo" />
            <h2 style={{ padding: "10px 20px", color: "black" }}>Credential</h2>

            <summary>
                <h3 style={{ color: "green" }}>Reveal</h3>
            </summary>
            <div>
                {Object.entries(details).map(([field, value]) => (
                    <div key={field}>
                        <label style={{ display: "block" }}>
                            {field}: {value}
                            <Switch
                                checked={revealDetails[field]}
                                onChange={() => handleToggleReveal(field)}
                                color="primary"
                            />
                        </label>
                    </div>
                ))}
            </div>

            <summary>
                <h3 style={{ color: "red" }}>Hide</h3>
            </summary>
            <div>
                {Object.entries(details).map(([field, value]) => (
                    <div key={field}>
                        <label style={{ display: "block" }}>
                            {field}: {value}
                            <Switch
                                checked={!revealDetails[field]}
                                onChange={() => handleToggleReveal(field)}
                                color="secondary"
                            />
                        </label>
                    </div>
                ))}
            </div>

            <Container style={styles.buttonBox}>
                <Button
                    size="medium"
                    variant="outlined"
                    onClick={handleContinueClick}
                >
                    Continue to application form
                </Button>
            </Container>
        </Typography>
    );
};

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
    },
    title: {
        flex: "1 0 auto",
    },
    list: {
        listStyle: "none",
    },
    li: {
        display: "flex",
    },
    buttonBox: {
        paddingTop: "10px",
        marginTop: "auto",
        marginBottom: "auto",
        width: "150px",
    },
    subtitle: {
        paddingTop: "10px",
    },
};

function mapStateToProps(state) {
    let user = state.oidc.user;

    if (!user) {
        const userDataCookie = getCookie('userData');
        if (userDataCookie) {
            try {
                user = JSON.parse(userDataCookie);
                user.profile = {
                    name: user.name,
                    birthdate: user.birthdate,
                    nickname: user.nickname,
                    middle_name: user.middle_name,
                    given_name: user.given_name,
                };
            } catch (e) {
                console.error('Error parsing JSON from cookie:', e);
            }
        }
    }

    return {
        user: user,
    };
}

// Function to get a specific cookie by name
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

export default connect(mapStateToProps)(Watch);
