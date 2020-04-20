import React, {Component} from "react";

class Todoitem extends Component {
  state = {
    task: ""
  } 

  constructor(props){
    super(props);

    this.state = {
      task: props.task,
      index: props.index
    };
  }

  updateTodo(ev){ 
    this.props.updateParent(ev.target.value, this.props.index);
    this.setState({
      task: ev.target.value
    });
  }

  setToActive(){
    this.props.setToActive(this.props.index);
  }

  deleteTodo(){
    this.props.delete(this.props.index);
  }

  render(){
    return ( 
      <div className = "todoItem">
        <input value={this.state.task} 
            onClick ={()=>this.setToActive()} 
            onInput = {(ev)=>this.updateTodo(ev)}
            onChange = {(ev)=>"test"}
            />
        <div className = "deleteTodo" onClick = {(ev)=>this.deleteTodo(ev)}>
          <div id="mdiv">
            <div className="mdiv">
              <div className="md"></div>
            </div>
          </div>
        </div>
        <div className = "clear"></div>
      </div>
    );
  }
}

export default Todoitem;
