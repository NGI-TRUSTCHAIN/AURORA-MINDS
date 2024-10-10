import React from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { Button, Container, Typography } from "@material-ui/core";

class FrontPage extends React.Component {
  render() {
    return (
      <Container >
        <Container style={styles.title}>
          <Typography variant="h3" align="center">
            Welcome to
          </Typography>
          <Typography variant="h2" align="center">
            University Verification System
          </Typography>
        </Container>
        <Typography variant="subtitle1" align="center" style={styles.subtitle}>

        </Typography>
        <Container style={styles.buttonBox}>
          <Button
            size="medium"
            variant="outlined"
            onClick={(event) => {
              event.preventDefault();
              this.props.dispatch(push("/login"));
            }}
          >
            Login
          </Button>
        </Container>
      </Container>
    );
  }
}

const styles = {
  buttonBox: {
    paddingTop: "10px",
    marginTop: "auto",
    marginButtom: "auto",
    width: "150px",
  },
  subtitle: {
    paddingTop: "10px",
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

export default connect(mapStateToProps)(FrontPage);
