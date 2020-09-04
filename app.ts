const localConfig = require("./localconfig");
const express = require("express");
const path = require("path");
const app = express();
const colors = require("colors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const stackTrace = require("stack-trace");
const jwtHelper = require("./backend/utils/jwtHelper");
const UserData = require("./backend/dataAccess/users");
const ListData = require("./backend/dataAccess/lists");

const port = 8080;
const curEnv = localConfig.curEnv;
const dev = (curEnv === "development");
const dbConnection = require("./backend/dataAccess/dbConnection");
let ejs = require("ejs");
require("pretty-error").start();

app.use(cookieParser(localConfig.cookieSecret, { httpOnly: true })); 
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

ejs.delimiter = "?";
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "dist")));

app.use(function(req, res, next) {
  if(dev){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  } 
  
  // res.header("Content-Type", "text/html");
  next();
});

if(dev){
  // const prima = require('esprima');
  // var scan = require('scope-analyzer');
  global.l = console.log;

  global.e = (msg, code)=>{
    throw `error, ${msg}`;
  };

  global.tr = (depth)=>{
    var t = stackTrace.get();
    var spacer = "";
    if(!depth){depth = t.length;}
    for(var i = 1; i<depth;i++){ //set to one to skip the reference to this file
      const l = t[i];
      console.log(spacer + l.getLineNumber() + " " + l.getFunctionName() + " " + l.getFileName() + " ");
      spacer = spacer + " ";
    }
  };
} else {
  global.tr = global.l = global.e = console.log = ()=>{};
}

global.n = (val)=>{
  return (val === undefined || val === null);
};



app.use(function(req, res, next) {
  const encodedToken = req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  !n(encodedToken)? req.userToken = jwtHelper.verifyLoginToken(encodedToken):null;
 
  next();
});

app.get("/", (req,res) => {

  if(!n(req.userToken)){
    UserData.getUserByUsername(req.userToken, (getUserError, resUser)=>{
      ListData.getListbyUserId(resUser.memberID, (getListError, resList)=>{

        let actuallyEmpty = false;

        if(resList.list.length === 0){
          actuallyEmpty = true;
        }

        res.render(path.resolve(__dirname, "dist", "index.ejs"), {
          lastUsedList: JSON.stringify(resList.list),
          userListActuallyEmpty: actuallyEmpty
        });

      });
    });
  } else {
    l("encodedToken is null");
    res.render(path.resolve(__dirname, "dist", "index.ejs"), {
      lastUsedList: JSON.stringify([]),
      userListActuallyEmpty: false
    });
  }
});

dbConnection(localConfig.dbCreds);

app.use(require("./backend/list/listRoutes"));
app.use(require("./backend/users/userRoutes"));

app.get("/login/", function (req, res) {
  res.header("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.get("/register/", function (req, res) {
  res.header("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(colors.yellow(`Listening to app on server port ${port} in ${curEnv} mode`));
}); 

export {};