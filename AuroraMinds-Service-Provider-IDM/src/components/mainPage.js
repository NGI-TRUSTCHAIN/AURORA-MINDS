import React from "react";
import { connect } from "react-redux";
import { userManager, userManagerOlympus } from "../utils/userManager";
import { Button, Container, Typography, MenuItem, Menu, IconButton, AppBar, Toolbar, Box } from "@material-ui/core";
import { push } from "react-router-redux";
import LoginPage from "./loginPage";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import swal from 'sweetalert2';
import AccountCircle from '@material-ui/icons/AccountCircle';

class MainPage extends React.Component {

  constructor(props) {
    super(props);

    document.cookie = 'userData=' + encodeURIComponent(JSON.stringify(props.user.profile));
    }

  render() {
    const { user } = this.props;
    console.log("start user");
    console.log(user);
    console.log("end user");

    let birthdate = 24;
    let today = new Date();
    console.log(today.getYear());
    today.setYear(today.getYear() + 1900 - 18);
    let over18 = new Date(birthdate) < today;

    if (!over18) {
      alert(" Your age is under 18, sending back to the login page...");
      return <LoginPage />;
    }

    var hasRegistered = localStorage.getItem('hasRegistered');
    if (!hasRegistered) {
      swal.fire("You have successfully registered to Aurora Minds");
    }
    localStorage.setItem('hasRegistered', 'true');

    return (
      <Container style={styles.root}>
        <Container style={styles.header}>
          <AppBar position="static" style={styles.appBar}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <AccountCircle style={{ fontSize: 40 }} />
              </IconButton>
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <Button color="inherit" {...bindTrigger(popupState)} style={styles.menuButton}>
                      MAIN PAGE
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                      <MenuItem onClick={(event) => {
                        event.preventDefault();
                        userManager.getUser();
                        userManagerOlympus.storeUser();
                        swal.fire({
                          title: "Privacy notice!",
                          text: "Sensitive information will be rendered to the screen",
                          icon: "warning",
                          button: "Ok",
                        }).then(r => this.props.dispatch(push("/information")));
                      }}>Personal Information</MenuItem>
                      <MenuItem onClick={(event) => {
                        event.preventDefault();
                        userManager.getUser();
                        userManagerOlympus.storeUser();
                        window.open("http://localhost:8080/changePassword", "_blank");
                      }}>Change Password</MenuItem>
                      <MenuItem onClick={(event) => {
                        event.preventDefault();
                        userManager.getUser();
                        userManagerOlympus.storeUser();
                        window.open("http://localhost:8080/deleteAccount", "_blank");
                      }}>Delete Account</MenuItem>
                      <MenuItem onClick={(event) => {
                        event.preventDefault();
                        userManager.removeUser();
                        userManagerOlympus.removeUser();
                        sessionStorage.clear();
                        window.open("http://localhost:8080/logout", "_blank");
                      }} style={{ color: "red" }}>Logout</MenuItem>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </Toolbar>
          </AppBar>
        </Container>
        <Typography variant="h4" style={styles.welcomeMessage}>
          Welcome user. This is the main dashboard.
        </Typography>
        <Typography variant="h6" style={styles.subtitle}>
          Access the Management System
        </Typography>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          style={styles.actionButton}
          onClick={(event) => {
            event.preventDefault();
            userManager.getUser();
            userManagerOlympus.storeUser().then(r => this.props.dispatch(push("/checkAccessCredential")));
          }}
        >
          Get Credential
        </Button>
      </Container>
    );
  }
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(to right, #33a7c4, #74bfc4)",
    padding: "40px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
  },
  header: {
    width: "100%",
    marginBottom: "20px",
  },
  appBar: {
    background: "linear-gradient(to right, #33a7c4, #74bfc4)",
    borderRadius: "10px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
  },
  menuButton: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  welcomeMessage: {
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center",
  },
  subtitle: {
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center",
  },
  actionButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    textTransform: "none",
    fontSize: "16px",
  },
};

function mapStateToProps(state) {
  return {
    user: state.oidc.user,
  };
}

export default connect(mapStateToProps)(MainPage);