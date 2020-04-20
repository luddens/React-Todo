const UserData = require("../dataAccess/users");
const ListData = require("../dataAccess/lists");

const listController = ()=> {
  const getList = (req, res) => {
    res.send({test: "test"});
  };

  const setList = (req, res) => {
    let username = req.userToken;
    
    l("Decoded username: " + username);

    if(!n(username)){
      UserData.getUserByUsername(username, (getUserError, resUser)=>{
        if(n(getUserError)){
          if(!n(resUser)){
            l(resUser); 
            
            const newList = {
              creationDate: new Date().getTime(),
              memberID: resUser.memberID,
              name: "",
              list: req.body.list
            };

            ListData.updateList(resUser.memberID, newList, (saveListErr, savedList)=>{
              if(n(saveListErr)){ 
                if(!n(savedList)){
                  l("savedList");
                  l(savedList);
                  let {list, creationDate} = savedList;
                  res.status("200").send({list, creationDate});
                } else {
                  res.status("204").send({data: "List not saved"});
                }
              } else {
                res.status("500").send({data: "Error creating new list"});
              }
            });
          } else { 
            res.status("404").send({data: "No user found"});
          }
        } else {
          res.status("500").send({data: "Error"});
        }
      });
    } else {
      l("User not logged in");
      res.status("204").send({data: "User not logged in"});
    }
  };

  return {
    getList,
    setList
  };
};

module.exports = listController();