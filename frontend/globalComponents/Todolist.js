import {PropTypes} from "prop-types";
import React, {Component} from "react";
import Todoitem from "./Todoitem";
import Api from "../API/globalAPI";
import {uuid} from "uuidv4";
import TodoListStore from "../stores/TodoListStore";
import LocalStore from "../stores/LocalStore";

var lastUsedList = TodoListStore.store.getLastUsed();

class Todolist extends Component { 
  constructor(props){
    super(props);
    
    let list = [];

    if(lastUsedList !== undefined && lastUsedList.length > 0){
      list = lastUsedList;
    } else {
      if(window.actuallyEmpty === true){
        list = [];
      } else {
        console.log("localList");
        console.log(localStorage.getItem("localList"));
        list = [
          "do thing a",
          "do thing b",
          "do thing c",
          "do thing d",
          "do thing e",
          "do thing f",
          "do thing g",
        ];
      }
    }

    this.textList = list;
    
    this.state = ({
      constructedList: this.buildTodoList(list)
    });
  }
  
  textList = []; //just the text representation of the list to get constructed later;
  listDefaultLength = 10;
  listMaxLength = 20;
  activeListItem = 0;
  

  // getList = () => {Api.getList("myUsername", "myPassword!");}

  componentDidMount(){
    LocalStore.store.on("update_login_status", this.retrieveLoginList);
  } 

  retrieveLoginList=()=>{
    this.textList = LocalStore.store.getLoginList().data;
    TodoListStore.store.setListFromLogin(this.textList);
    this.updateConstructedList();
  }
  
  updateConstructedList =()=>{
    this.setState( state => {
      return{
        constructedList: this.buildTodoList(this.textList),
      };
    });
  }

  addListItem = () => {
    this.textList.push("");
    Api.setList(this.textList,
      (err)=>{
        this.updateConstructedList();
      },
      (errMsg)=>{ console.log(errMsg);});
  }

  deleteListItem = (index) => {
    this.textList = this.textList.filter((item, i)=>{
      return i !== index;
    });
    Api.setList(this.textList,
      (err)=>{
        this.updateConstructedList();
      },
      (errMsg)=>{ console.log(errMsg);});
  };

  clearList = () => {
    this.textList.length = 0;
    this.updateConstructedList();
  }

  setToActive=(index)=>{
    this.activeListItem = index;
  }
  
  updateCompleteList = (newVal, index) => {  
    this.textList[index] = newVal;
  }
  
  buildTodoList = (todoList) =>{
    const renderedList = [];

    for(var i = 0; i < todoList.length; i++){
      renderedList.push(
        <Todoitem key = {uuid()}
                  index = {i}
                  active = {i === this.activeListItem?true:false} 
                  setToActive = {this.setToActive} 
                  delete = {this.deleteListItem} 
                  task = {todoList[i]}
                  placeholder = "enter new task here"
                  updateParent = {this.updateCompleteList}/>
      );
    }
    
    return renderedList;
  }

  render(){
    return ( 
      <div id = "todolist">
        <button className = "getlist" onClick = {()=>this.getList()}>Save List</button>
        <button className = "additem" onClick = {()=>this.addListItem()} >Add Item</button>
        {this.state.constructedList}
        {/* <button className = "clearall" onClick = {()=>this.clearList()}>Clear All</button> */}
      </div>
    );
  }
} 

// Todolist.contextTypes = {
//   history: PropTypes.func.isRequired
// };

Todolist.displayName = "Todolist";

export default Todolist;
