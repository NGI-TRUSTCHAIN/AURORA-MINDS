import React from "react";
import { connect } from "react-redux";
import FrontPage from "./frontPage";
import LoginPage from "./loginPage";
import MainPage from "./mainPage";

function HomePage(props) {
    const { user } = props

	return !user ? <LoginPage /> : <MainPage />;
}

function mapStateToProps(state) {
  return {
    user: state.oidc.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
