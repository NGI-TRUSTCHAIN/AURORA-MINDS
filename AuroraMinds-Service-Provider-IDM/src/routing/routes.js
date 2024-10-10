import React from "react";
import { Router, Route, browserHistory } from "react-router";
import HomePage from "../components/homePage";
import { syncHistoryWithStore } from "react-router-redux";
import CallbackPageOL from "../components/callbackOL";
import CallbackPageKC from "../components/callbackKC";
import LoginPage from "../components/loginPage";
import MainPage from "../components/mainPage";
import store from "../store/store";
import CredentialStorage from "../components/credentialStorage";
import CheckalreadyCredential from "../components/checkalreadyCredential";
import personalization from "../components/personalization";
import StorageC from "../components/Storage";
import CheckAccessCredential from "../components/CheckAccessCredential";
import verifier from "../components/watch-verifier"
import verificationPage from '../components/verificationPage';
import loginDS from '../components/loginDS';
import verifyPresentation from '../components/verifyPresentation';
import testingCookie from '../components/testingCookie';
const history = syncHistoryWithStore(browserHistory, store);

export default function Routes(props) {
  return (
    <Router history={history}>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/success" component={MainPage} />
      <Route path="/callbackOL" component={CallbackPageOL} />
      <Route path="/callbackKC" component={CallbackPageKC} />
      <Route path="/create/credential" component={CredentialStorage}/>
      <Route path="/already/credential" component={CheckalreadyCredential} />
      <Route path="/information" component={personalization}/>
      <Route path="/Storage" component={StorageC} />
      <Route path="/already/credential/Storage" component={StorageC}/>
      <Route path="/checkAccessCredential" component={CheckAccessCredential} />
      <Route path="/checkAccessCredential/Storage" component={StorageC} />
      <Route path="/checkAccessCredential/already/credential" component={CheckalreadyCredential} />
      <Route path="/checkAccessCredential/already/credential/verifier" component= {verifier}/>
      <Route path="/checkAccessCredential/already/credential/verifier/verificationPage" component= {verifier}/>
      <Route path="/login_DS" component= {loginDS}/>
      <Route path="/login_DS/verifyPresentation" component= {verifyPresentation}/>
      <Route path="/testing" component= {testingCookie}/>
    </Router>
  );
}
