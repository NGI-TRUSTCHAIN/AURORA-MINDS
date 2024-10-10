import { Box, Button, Typography } from "@material-ui/core";
import DirectionsIcon from '@material-ui/icons/Directions';
import React from "react";
import { userManager, userManagerOlympus } from "../utils/userManager";

class LoginPage extends React.Component {

  onLoginClick(event) {
    event.preventDefault();
    userManager.signinRedirect();
  }

  onLoginClickOlympus(event) {
    event.preventDefault();
    userManagerOlympus.signinRedirect();
  }

  onLoginCredentialsClick(event) {
     event.preventDefault();
     window.location.href = "http://localhost:8080/loginCredentials";
   }

  render() {
    return (
      <Box style={styles.root}>
        <Typography variant="h5" align="center">
          User Authorization
        </Typography>

        <Button
          size="large"
          variant="outlined"
          startIcon={<DirectionsIcon />}
          onClick={this.onLoginClickOlympus}
          style={styles.button}
        >
          Log in with Aurora Minds
        </Button>

        <Button
          size="large"
          variant="outlined"
          startIcon={<DirectionsIcon />}
          onClick={this.onLoginCredentialsClick}
          style={styles.button}
        >
          Log in with Credentials
        </Button>
      </Box>
    );
  }
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    flexShrink: 1,
  },
  button: {
    marginTop: "20px",
  },
};

export default LoginPage;
