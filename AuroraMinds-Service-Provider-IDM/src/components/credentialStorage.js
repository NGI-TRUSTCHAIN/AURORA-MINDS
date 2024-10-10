import React from "react";
import { connect } from "react-redux";
import { userManager, userManagerOlympus } from "../utils/userManager";
// import { userManager, userManagerOlympus } from "../../../olympus-service-provider/src/utils/userManager";
import { push } from "react-router-redux";
import swal from "sweetalert";
import {AppBar, Button, Container, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";

class CredentialStorage extends React.Component {

    componentDidMount() {
        // Perform data verification when the component mounts
        this.verifyUserData(this.props.user);
    }

    // Function to verify user data
    verifyUserData(user) {
        const requiredFields = ["name", "sub", "birthdate", "nickname", "middle_name", "family_name"];

        if (user && user.profile) {
            // Check if all required fields exist in the user object
            const missingFields = requiredFields.filter((field) => !user.profile[field]);

            if (missingFields.length === 0) {
                // All required fields are present, data is valid
                swal({
                    title: "New Curriculum",
                    text: "would like to deliver a Credential to your Storage!",
                    icon: "warning",
                    button: "Allow",
                });
            } else {
                // Some required fields are missing
                swal({
                    title: "Error",
                    text: `Missing fields: ${missingFields.join(", ")}`,
                    icon: "error",
                    button: "Close",
                });
            }
        } else {
            // User object or profile data is missing
            swal({
                title: "Error",
                text: "User data is missing or incomplete.",
                icon: "error",
                button: "Close",
            });
        }
    }



    render() {
        // Render your component's UI here
        const { user } = this.props;

        return (
            <div style={styles.root}>
                <div style={styles.title}>
                    <Box sx={{ flexGrow: 1 }}>

                    </Box>
                    <AppBar position="static">
                    <Typography variant="subtitle1" align="center">
                        <div align="center">
                            <h2 style={{ color:"forestgreen" }}>PESTO Credential Created!</h2>
                            <img src={"/university.png"} width="250" height="160" />
                            <h4 style={{ color: "grey" }}>Full Name: {user ? user.profile.name : "Mister Unknown"}</h4>
                            <h4 style={{ color: "grey" }}>Username: {user ? user.profile.sub : "Mister Unknown"}</h4>
                            <h4 style={{ color: "grey" }}>Birthdate: {user ? user.profile.birthdate : "Birth"}</h4>
                            <h4 style={{ color: "grey" }}>Student Id: {user ? user.profile.nickname : "-"}</h4>
                            <h4 style={{ color: "grey" }}>Address: {user ? user.profile.middle_name : "Address 1"}</h4>
                            <h4 style={{ color: "grey" }}>Phone Number: {user ? user.profile.family_name : "-"}</h4>
                            <Container style={styles.buttonBox} align="center">

                                {/*<Button*/}
                                {/*    size="large"*/}
                                {/*    variant="outlined"*/}
                                {/*    o onClick={() => {*/}
                                {/*    userManager.getUser();*/}
                                {/*    userManagerOlympus.storeUser();*/}
                                {/*    // this.props.dispatch(push("/verify"));*/}
                                {/*    setTimeout(() => window.open("http://localhost:3000/applicationForm", "_blank"), 1000);*/}
                                {/*}}*/}
                                {/*>*/}
                                {/*    Continue to application form*/}
                                {/*</Button>*/}
                                <br/>
                                <Button
                                    size="medium"
                                    variant="outlined"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        userManager.getUser();
                                        userManagerOlympus.storeUser();
                                        window.close();
                                        window.open("http://localhost:8080/logout", "_self");
                                    }}
                                    style={{background:"#cd101c"}}
                                >
                                    Close and logout
                                </Button>
                            </Container>
                        </div>
                    </Typography>
                    </AppBar>
                </div>
            </div>
        );
    }

}

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        top: "10%",
        left:"45%",
        position: "fixed",
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
};

function mapStateToProps(state) {
    return {
        user: state.oidc.user,
    };
}

export default connect(mapStateToProps)(CredentialStorage);