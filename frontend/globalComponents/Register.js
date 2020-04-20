import React, {Component} from "react";
import Api from "../API/loginAPI";

class Register extends Component {
  state = {
    username: "",
    password: "",
    email: "",
  }

  register = () => {
    event.preventDefault();
    Api.register({
      username: this.state.username,
      password: this.state.password,
      email: this.state.email
    });
  }

  updateUsername = (val) => {
    this.setState({
      username: val
    });
  }

  updateEmail = (val) => {
    this.setState({
      email: val
    });
  }

  updatePassword = (val) => {
    this.setState({
      password: val
    });
  }

  render(){
    return ( 
      <div id = "registerModal">
        <form onSubmit={this.register}>
          <input onChange = {(ev)=>this.updateUsername(ev.target.value)} placeholder = "Username"></input>
          <input onChange = {(ev)=>this.updatePassword(ev.target.value)} placeholder = "Password"></input>
          <input onChange = {(ev)=>this.updateEmail(ev.target.value)} placeholder = "EmailAddress"></input>
          <input type="submit" value="Register"></input>
        </form>
      </div>
    );
  }
}

Register.displayName = "Register component";

export default Register;
