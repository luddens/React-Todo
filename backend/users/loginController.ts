const UserData = require("../dataAccess/users");
const jwtHelper = require("../utils/jwtHelper");
const curEnv = require("../../localconfig").curEnv;
const dev = (curEnv === "development");
const ListData = require("../dataAccess/lists");

const loginController = () =>{
  const login = async (req, res) =>{
    const loginUser = {
        username: req.body.username,
        password: req.body.password
    };

    UserData.getUserByUsername(loginUser.username, (getUserError, resUser)=>{
      if(n(getUserError)){
        if(!n(resUser)){
          UserData.comparePassword(loginUser.password, resUser.password, (compareErr, match)=>{
            if(n(compareErr)){
              if(!n(match)){
                if( match !== false ){
                  l("Login Success for user:");
                  l(resUser);
                  
                  ListData.getListbyUserId(resUser.memberID, (getListError, resList)=>{
                    if(n(getListError)){
                      const token = jwtHelper.getLoginToken(loginUser.username);
                      const expiryTime = Date.now() + (dev?360000:3600000);
                      
                      res.cookie("expiryTime", 
                        expiryTime, 
                        {expires: new Date(expiryTime),
                          secure: !dev,
                          httpOnly: false,
                        });

                      res.cookie("token", 
                        token, 
                        {expires: new Date(expiryTime),
                          secure: !dev,
                          httpOnly: true,
                        });

                      res.cookie("loggedIn", 
                        true, 
                        {expires: new Date(expiryTime),
                          secure: !dev,
                          httpOnly: false,
                        });

                      res.status("200").send({data: resList.list});
                    }
                  });

                } else {
                  l("Login Failed: Incorrect Password");
                  res.status("404").send({data:"User not found"});
                }
              } else {
                l("comparePassword: Error comparing passwords");
                res.status("500").send({data:"Login Failed"});
              } 
            } else {
              l("compareErr Error");
              e(compareErr);
              res.status("500").send({data:"Error"}); 
            }
          });
        } else {
          l("getUserError Error, user not found");
          res.status("404").send({data:"User not found"}); 
        }
      } else {
        l("getUserError Error");
        res.status("500").send({data:"Error searching for user"});
      }
    });
  };
  
  const logout = async (req, res) =>{
    res.clearCookie("token", "", {expires: Date.now()});
    res.send({data: "logout"});
  };

  return {
    login,
    logout
  };
};

module.exports = loginController();
