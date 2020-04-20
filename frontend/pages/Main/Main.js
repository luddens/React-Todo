import React, {Component} from "react";
// import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
// import {PropTypes} from "prop-types";

import Register from "../../globalComponents/Register";
import Login from "../../globalComponents/Login";
import Todolist from "../../globalComponents/Todolist";
import Header from "../../globalComponents/Header";
import LocalStore from "../../stores/LocalStore";


class Main extends Component {
  state = {
    loggedIn: LocalStore.store.getLoggedIn(),
    unmountLoginForms: LocalStore.store.getLoggedIn(),
  }

  hideLoginForms=(showDelayTime)=>{
    this.setState({
      loggedIn: true,
    });

    setTimeout(()=>{
      this.setState({
        unmountLoginForms: true
      });
    }, 1000); //1000 is the scss animation time

    this.revealLoginForms(showDelayTime);
  }

  componentDidMount(){
    if(LocalStore.store.getLoggedIn()){
      this.revealLoginForms(LocalStore.store.getLoginExpiryTime());
    }
  } 

  revealLoginForms=(delay)=>{
    setTimeout(()=>{
      
      this.setState({
        unmountLoginForms: false,
        loggedIn: false
      });
    }, delay);
  }

  render(){
    var loginInnerContainerClasses = (this.state.loggedIn?"hidden": "") + " anim";
    return (
      <div id = "main">
        <div>
          <Header/>
          <Todolist />
          <div id = "loginFormsContainer">
            <div className = {loginInnerContainerClasses} >
              {!this.state.unmountLoginForms ? <Register hideSelf = {this.hideLoginForms} showSelf = {this.revealLoginForms} /> :null}
              {!this.state.unmountLoginForms ? <Login  hideSelf = {this.hideLoginForms} showSelf = {this.revealLoginForms}/> :null}
            </div>
          </div>
          {/*<BrowserRouter>
            <Switch>  
              <Route exact path="/" component={Todolist} />
              <Route exact path="/login" render={(props) => {
                                    if(!LocalStore.getLoggedIn()){
                                        return <Login {...props} />;
                                    } else {
                                        return <Redirect to="/"/>;
                                    }                   
                                }}>
              </Route>

              <Route exact path="/register" render={(props) => {
                                    if(!LocalStore.getLoggedIn()){
                                        return <Register {...props} />;
                                    } else {
                                        return <Redirect to="/"/>;
                                    }                   
                                }}>
              </Route>
            </Switch>
          </BrowserRouter> */}
        </div>
      </div>
    );
  }
} 

Main.displayName = "Main";

export default Main;
