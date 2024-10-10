import React from "react";
import { userManager } from "../utils/userManager";
import { OidcProvider } from "redux-oidc";
import Routes from "../routing/routes";
import store from "../store/store";
import Root from "./root";
import { Paper } from "@material-ui/core"
import Box from "@material-ui/core/Box";
import { Container } from "@material-ui/core";
import { theme } from "../theme";
import { MuiThemeProvider } from "material-ui/styles";

function App() {
  return (
    <Container style={styles.background} maxWidth="100%">
      <MuiThemeProvider theme={theme}>
        <Container style={styles.content}>
          <Box style={styles.box} boxShadow={3}>
            <Paper style={styles.paper}>
              <OidcProvider store={store} userManager={userManager}>
                <Root>
                  <Routes />
                </Root>
              </OidcProvider>
            </Paper>
          </Box>
        </Container>
      </MuiThemeProvider>
    </Container>
  );
}

const styles = {
  background: {
    backgroundImage: `url(${Image})`,
    backgroundSize: "cover",
    height: "1280px",
    paddingTop: "0px",
  },
  box: {
    maxWidth: "600px",
    maxHeight: "350px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  paper: {
    maxWidth: "600px",
    maxHeight: "350px",
  },
  content: {
    paddingTop: "250px",
  },
};
export default App;
