import React from "react";
import {connect} from "react-redux";
import { userManager, userManagerOlympus } from "../utils/userManager";
// import {userManager, userManagerOlympus} from "../../../olympus-service-provider/src/utils/userManager";
import {push} from "react-router-redux";
import swal from 'sweetalert';
import {Button, Container, Typography, Toolbar, MenuItem, Box, Menu, IconButton, AppBar} from "@material-ui/core";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import MenuIcon from "@mui/icons-material/Menu";
import PopupState, {bindMenu, bindTrigger} from "material-ui-popup-state";

class personalization extends React.Component {
    render() {

        sessionStorage.setItem('', 'value');
        let data = sessionStorage.getItem('key');
        sessionStorage.removeItem('key');
        sessionStorage.clear();

        const {user} = this.props;


        return (


            <div style={styles.root}>
                <div style={styles.title}>
                    <Box sx={{flexGrow: 1}}>

                    </Box>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{mr: 2}}
                            >
                            </IconButton>
                            <PopupState variant="popover" popupId="demo-popup-menu">
                                {(popupState) => (
                                    <React.Fragment>
                                        <Button color="inherit" uppercase={false} {...bindTrigger(popupState)}
                                                size="small"

                                        >
                                            IMPORTANT INFORMATION
                                        </Button>

                                        <Menu {...bindMenu(popupState)}>
                                            <MenuItem onClick={() => {
                                            }}
                                                      style={{color: "red"}}>Welcome {user ? user.profile.name : "Mister Unknown"}</MenuItem>
                                            <MenuItem onClick={(event) => {
                                                event.preventDefault();
                                                userManager.getUser();
                                                userManagerOlympus.storeUser().then(r => this.props.dispatch(push("/success")))
                                            }}>Home</MenuItem>
                                            <MenuItem onClick={(event) => {
                                                event.preventDefault();
                                                userManager.getUser();
                                                userManagerOlympus.storeUser().then(r => this.props.dispatch(push("/information")))
                                            }}>Personal Information</MenuItem>
                                            {/*<MenuItem onClick={(event) => {*/}
                                            {/*    event.preventDefault();*/}
                                            {/*    // userManager.getpolicy()*/}
                                            {/*    //policy edw kai meta store*/}
                                            {/*    userManager.getUser();*/}
                                            {/*    userManagerOlympus.storeUser().then(r => this.props.dispatch(push("/success")))*/}
                                            {/*}}>See your Credentials</MenuItem>*/}
                                            <MenuItem onClick={(event) => {
                                                event.preventDefault();
                                                userManager.getUser();
                                                userManagerOlympus.storeUser();
                                                window.close();
                                                window.open("http://localhost:8080/deleteAccount", "_blank");
                                            }}>Delete Account</MenuItem>
                                            <MenuItem onClick={(event) => {
                                                event.preventDefault();
                                                userManager.getUser();
                                                userManagerOlympus.storeUser();
                                                window.close();
                                                window.open("http://localhost:8080/logout", "_self");
                                            }}>Logout</MenuItem>
                                        </Menu>

                                    </React.Fragment>
                                )}
                            </PopupState>


                        </Toolbar>

                    </AppBar>
                    <Typography variant="subtitle1" align="center">

                        <img src={"/university.png"} width="250" height="160"/>
                    </Typography>
                    <Typography variant="subtitle1" align="center">

                        <h4 style={{color: "grey"}}>Full Name:{user ? user.profile.name : "Mister Unknown"}</h4>
                        <h4 style={{color: "grey"}}> Username: {user ? user.profile.sub : "Mister Unknown"}</h4>
                        <h4 style={{color: "grey"}}>Birthdate: {user ? user.profile.birthdate : "Birth"}</h4>
                        <h4 style={{color: "grey"}}>User ID: {user ? user.profile.nickname : "User ID"}</h4>
                        <h4 style={{color: "grey"}}>Email: {user ? user.profile.middle_name : "Address 01"}</h4>
                       {/* <h4 style={{color: "grey"}}>Phone Number: {user ? user.profile.family_name : "Address 01"}</h4> */}


                    </Typography>
                </div>

            </div>

        );
    }
}

const styles = {
    root: {
        display: "flex",
        flexDirection: "column"
    },
    title: {
        flex: "1 0 auto"
    },
    list: {
        listStyle: "none"
    },
    li: {
        display: "flex"
    }
};

function mapStateToProps(state) {
    return {
        user: state.oidc.user,
    };

}

export default connect(mapStateToProps)(personalization);
