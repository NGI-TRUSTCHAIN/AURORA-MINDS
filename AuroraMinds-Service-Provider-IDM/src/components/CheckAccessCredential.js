import React from "react";
import { connect } from "react-redux";
import { userManager, userManagerOlympus } from "../utils/userManager";
import { Button, Container, Typography, IconButton, Box, AppBar, Toolbar } from "@material-ui/core";
import { push } from "react-router-redux";
import PopupState, { bindTrigger } from 'material-ui-popup-state';
import swal from 'sweetalert';
import AccountCircle from '@material-ui/icons/AccountCircle';

const CheckAccessCredential = ({ user, dispatch }) => {

  const hasAccess = () => {
    if (!user.profile.name || !user.profile.middle_name || !user.profile.nickname) {
      swal({
        title: "Get Credential!",
        text: "Credential  not found. Redirection to Get Credential...",
        icon: "warning",
        button: "Ok",
      }).then((r) => {
        userManager.getUser();
        userManagerOlympus.storeUser();
        user.profile.name = localStorage.getItem("name");
        user.profile.birthdate = localStorage.getItem("birthdate");
        user.profile.nickname = localStorage.getItem("nickname");
        user.profile.middle_name = localStorage.getItem("middle_name");
        user.profile.given_name = localStorage.getItem("given_name");
        dispatch(push("/checkAccessCredential/already/credential"));
      });
    } else {
      swal({
        title: "Access Granted!",
        text: "This user posses a valid Credential",
        icon: "success",
        button: "Ok",
      }).then((r) => {
        userManager.getUser();
        userManagerOlympus.storeUser();
        dispatch(push("/checkAccessCredential/Storage"));
      });
    }
  };

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
                  Check Access
                </Button>
              </React.Fragment>
            )}
          </PopupState>
        </Toolbar>
      </AppBar>

      <Typography variant="h4" style={styles.title}>
        Check Access Credential
      </Typography>

      <Box style={styles.buttonBox}>
        {!user.profile.name || !user.profile.nickname || !user.profile.middle_name || !user.profile.preferred_username || !user.profile.birthdate ? (
          <Button
            size="medium"
            variant="contained"
            color="primary"
            style={styles.actionButton}
            onClick={hasAccess}
          >
            Get A Credential
          </Button>
        ) : (
          <Button
            size="medium"
            variant="contained"
            color="primary"
            style={styles.actionButton}
            onClick={hasAccess}
          >
            Login Via Credential
          </Button>
        )}
      </Box>
    </Container>
  );
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "40px",
    background: "linear-gradient(to right, #33a7c4, #74bfc4)",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    boxSizing: "border-box",
  },
  appBar: {
    background: "linear-gradient(to right, #33a7c4, #74bfc4)",
    borderRadius: "10px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  title: {
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center",
  },
  menuButton: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  buttonBox: {
    paddingTop: "10px",
    width: "150px",
    display: "flex",
    justifyContent: "center",
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

export default connect(mapStateToProps)(CheckAccessCredential);