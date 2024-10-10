import React from "react";
import { AppBar, Button, Container, IconButton, Menu, MenuItem, Typography, Toolbar, Box, Card } from "@material-ui/core";
import { userManager, userManagerOlympus } from "../utils/userManager";
import { push } from "react-router-redux";
import swal from "sweetalert";
import { connect } from "react-redux";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AccountCircle from '@material-ui/icons/AccountCircle';

class StorageC extends React.Component {

  constructor(props) {
    super(props);
//    const date = new Date();
//    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
//    const expires = "; expires=" + date.toUTCString();
//    document.cookie = 'user=' + JSON.stringify(props.user.profile);


    this.state = {
      user: {
        profile: {
          name: this.props.user.profile.name,
          birthdate: this.props.user.profile.birthdate,
          nickname: this.props.user.profile.nickname,
          middle_name: this.props.user.profile.middle_name,
          given_name: this.props.user.profile.given_name,
        }
      },
      isDeleteButtonDisabled: false,
    };
  }

  componentDidMount() {
    this.ifCredentialisMissingDisableTheDeleteButton();
  }

  ifCredentialisMissingDisableTheDeleteButton = () => {
    const { profile } = this.props.user;
    if (!profile.name || !profile.birthdate  || !profile.nickname || !profile.middle_name || !profile.given_name) {
      this.setState({ isDeleteButtonDisabled: true });
    }
  }

  pressToDelete = () => {
    // Clear local storage
    localStorage.removeItem("name");
    localStorage.removeItem("birthdate");
    localStorage.removeItem("nickname");
    localStorage.removeItem("middle_name");
    localStorage.removeItem("given_name");

    // Clear state
    const updatedUser = {
      profile: {
        name: null,
        birthdate: null,
        nickname: null,
        middle_name: null,
        given_name: null,
      }
    };

    this.setState({ user: updatedUser, isDeleteButtonDisabled: true });

    // Update user profile
    this.props.user.profile.name = null;
    this.props.user.profile.birthdate = null;
    this.props.user.profile.nickname = null;
    this.props.user.profile.middle_name = null;
    this.props.user.profile.given_name = null;

    // Show alert
      swal({
          title: "Credential Deleted",
          text: "User credential deleted successfully",
          icon: "warning",
          button: "Ok",
        }).then(() => {
          window.location.href = "http://localhost:8080/logout";
        });
  }

  render() {
    const { user } = this.state;
    const { isDeleteButtonDisabled } = this.state;

    return (
      <Container style={styles.root}>
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
                    CREDENTIAL STORAGE
                  </Button>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem onClick={(event) => {
                      event.preventDefault();
                      userManager.getUser();
                      userManagerOlympus.storeUser();
                      swal({
                        title: "Returning to main page!",
                        text: "Redirection...",
                        icon: "warning",
                        button: "Ok",
                      }).then(r => this.props.dispatch(push("/success")));
                    }}>Home</MenuItem>
                    <MenuItem onClick={(event) => {
                      event.preventDefault();
                      userManager.getUser();
                      userManagerOlympus.storeUser();
                      swal({
                        title: "Privacy notice!",
                        text: "Sensitive informations will be render to the screen",
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

        <Typography variant="subtitle1" align="center" style={styles.title}>
          <img src={"/university.png"} width="250" height="160" alt="University Logo" />
        </Typography>

        <Card style={styles.card}>
          <Typography variant="body1" align="center">
            <details>
              <summary>Credentials Storage</summary>
              <Typography variant="body2" style={styles.credentials}>
                <div>FullName: {user ? user.profile.name : "Mister Unknown"}</div>
                <div>Birthdate: {user ? user.profile.birthdate : ""}</div>
                <div>User ID: {user ? user.profile.nickname : "-"}</div>
                <div>Email: {user ? user.profile.middle_name : "-"}</div>
                <div>Role: {user ? user.profile.given_name : "-"}</div>
              </Typography>

              <Button
                size="large"
                onClick={(event) => {
                  event.preventDefault();
                  this.pressToDelete();
                }}
                disabled={isDeleteButtonDisabled}
                style={styles.deleteButton}
              >
                Delete this Credential
              </Button>
            </details>
          </Typography>
        </Card>

        <Container style={styles.buttonBox}>
          <Button size="medium" variant="outlined" style={styles.continueButton}
            onClick={(event) => {
              event.preventDefault();
              userManager.getUser();
              userManagerOlympus.storeUser();
              try {
                if (user.profile.name) {
                  this.props.dispatch(push("/checkAccessCredential/already/credential/verifier"));
                } else {
                  window.close();
                  window.open("http://localhost:8080/error", "_self");
                }
              } catch (err) {
                console.log(err);
                window.close();
                window.open("http://localhost:8080/error", "_self");
              }
            }}>Continue to Application
          </Button>
        </Container>
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
    padding: "40px",
    background: "linear-gradient(to right, #33a7c4, #74bfc4)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    minHeight: "100vh",
  },
  appBar: {
    width: "100%",
    background: "linear-gradient(to right, #33a7c4, #74bfc4)",
    borderRadius: "10px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "20px",
  },
  menuButton: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    backgroundColor: "#ffffff",
  },
  credentials: {
    marginBottom: "20px",
  },
  deleteButton: {
    backgroundColor: '#c91313',
    color: 'white',
  },
  buttonBox: {
    display: "flex",
    justifyContent: "center",
  },
  continueButton: {
    color: "black",
  },
};

function mapStateToProps(state) {
  return {
    user: state.oidc.user,
  };
}

export default connect(mapStateToProps)(StorageC);
