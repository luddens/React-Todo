import React, {Component} from "react";
import Api from "../API/loginAPI"; 

// export const incVal = (old) => ({
//       passedVal: old.passedVal + 1
//     });

// export const decVal = (old) => ({
//       passedVal: old.passedVal - 1
//     });

class Login extends Component {
  state = {
    username: "",
    password: ""
  }
  
  login = (ev) => {
    ev.preventDefault();
    Api.login({
        username: this.state.username,
        password: this.state.password
      }, 
      (loadedList, revealDelay)=>{
        this.props.hideSelf(revealDelay);
      },
      (errMsg)=>{ console.log(errMsg);});
  }

  logout = () => {
    Api.logout( 
      (err)=>{
        this.props.hideSelf(0);
      },
      (errMsg)=>{ console.log(errMsg);});
  }
 
  updateUsername = (val) => {
    this.setState({
      username: val
    });
  }

  updatePassword = (val) => {
    this.setState({
      password: val
    });
  }

  render(){
    return ( 
      <div id = "loginModal">
        <form onSubmit = {this.login}>
          <input onChange = {(ev)=>this.updateUsername(ev.target.value)} placeholder = "Username"></input>
          <input onChange = {(ev)=>this.updatePassword(ev.target.value)} placeholder = "Password"></input>
          <input type="submit" value="Login"></input>
        </form>
        <button onClick = {()=>this.logout()} className = "logout">Logout</button>
      </div>
    );
  }
}

Login.displayName = "Login component";

export default Login;
