import React, { useState } from 'react';
import {AppBar, Button, Card, Container, MenuItem, Switch, Toolbar, Typography} from "@material-ui/core";
import { userManager, userManagerOlympus } from "../utils/userManager";
// import { userManager, userManagerOlympus } from "../../../olympus-service-provider/src/utils/userManager";
import swal from 'sweetalert';
import { connect } from "react-redux";
import Box from "@material-ui/core/Box";
import {push} from "react-router-redux";

const fieldDisplayNames = {
    name: "Full name",
    birthdate: "Date of Birth",
    nickname: "Student id",
    middle_name: "Email",
    given_name: "Role",
};

const CheckalreadyCredential = ({ user, dispatch }) => {

    const [revealDetails, setRevealDetails] = useState({
        name: true,
        birthdate: true,
        nickname: true,
        middle_name: true,
        given_name: true,

    });

    const handleToggleReveal = (field) => {
        setRevealDetails((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const canUserContinue = () => {
        // Verify if at least one field is set to true in revealDetails
        const atLeastOneFieldRevealed = Object.values(revealDetails).some((value) => value === true);

        // Check if tth current use belongs to the new curriculum
        const isNewCurriculum = user ? /^\d{4}$/.test(user.profile.nickname) : false;

        return atLeastOneFieldRevealed && isNewCurriculum;
    }

    const handleContinueClick = () => {
        userManager.getUser();
        userManagerOlympus.storeUser();

        const canContinue = canUserContinue();

        if (canContinue) {
            // Display information about revealed and hidden details
            const revealedInfo = Object.entries(revealDetails)
                .filter(([field, value]) => value)
                .map(([field, value]) => fieldDisplayNames[field] + ": " + (user ? user.profile[field] : field.charAt(0).toUpperCase() + field.slice(1)))
                .join(', ');

            const hiddenInfo = Object.entries(revealDetails)
                .filter(([field, value]) => !value)
                .map(([field, value]) => fieldDisplayNames[field] + ": " + (user ? user.profile[field] : field.charAt(0).toUpperCase() + field.slice(1)))
                .join(', ');

            swal({
                title: "Information",
                text: `Revealed: ${revealedInfo}\nHidden: ${hiddenInfo}`,
                icon: "info",
                button: "Ok",
            }).then(() => {
                // Aurora verification message
                swal({
                    title: "Success",
                    text: "You are Verified!!",
                    icon: "success",
                    button: "Ok",
                }).then(() => {
                    // After the user closes the second popup, open the application form
                    userManager.getUser();
                    userManagerOlympus.storeUser();
                    dispatch(push("/already/credential/Storage"));


                });
            });
        } else {
            // User does not meet the criteria, show a warning and initiate logout
            swal({
                title: "Details Not Revealed, Invalid Credentials",
                text: "Please select at least one detail to reveal.",
                icon: "warning",
                button: "Ok",
            }).then(() => {
                // Initiate logout
                userManagerOlympus.signoutRedirect(); // Use your OIDC client's signout method
            });
        }
    };

    return (
        // <div style={styles.root}>
        // <div style={styles.title}>
        // <AppBar position="static">
        <Box style={styles.root}>
            <Typography variant="subtitle1" align="center">
            <img src={"/university.png"} width="250" height="160"/>
            <h2 style={{ padding: "10px 20px", color: "black" }}>Credential Options</h2>


            <summary>
                <h3 style={{ color: "green" }}>Reveal</h3>
            </summary>
            <div>
                {Object.entries(revealDetails).map(([field, value]) => (
                    <div key={field}>
                        <label style={{ display: "block" }}>
                            {fieldDisplayNames[field]}: {/* Use display name here */}
                            {user ? user.profile[field] : field.charAt(0).toUpperCase() + field.slice(1)}
                            <Switch
                                checked={value}
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
                {Object.entries(revealDetails).map(([field, value]) => (
                    <div key={field}>
                        <label style={{ display: "block" }}>
                            {fieldDisplayNames[field]}: {/* Use display name here */}
                            {user ? user.profile[field] : field.charAt(0).toUpperCase() + field.slice(1)}
                            <Switch
                                checked={!value}
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
                    Continue to Application
                </Button>
            </Container>
            </Typography>
        </Box>

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
    return {
        user: state.oidc.user,
    };
}

export default connect(mapStateToProps)(CheckalreadyCredential);
