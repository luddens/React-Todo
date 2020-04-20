import React, {Component} from "react";
import Main from "./pages/Main/Main";

class App extends Component {
  state = {
    passedVal: 0
  }

  render(){

    return ( 
      <div id = "app">
        <Main/>
      </div>
    );
  }
}

App.displayName = "MainApp";

export default App;
