const UserData = require("../dataAccess/users");
const jwtHelper = require("../utils/jwtHelper");
const curEnv = require("../../localconfig").curEnv;
const dev = (curEnv === "development");

const registerController = ()=>{
  const register = async (req, res) =>{
    const newUser = new UserData({
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          token: ""
      });
    
    UserData.getUserByEmail(newUser.email, (getEmailErr, resUser)=>{
      if(n(getEmailErr)){
        if(n(resUser)){
          UserData.registerUser(newUser, (registerErr, registeredUser)=>{
            if(n(registerErr)){
              if(!n(registeredUser)){
                const token = jwtHelper.getLoginToken(newUser.username);
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

                l(registeredUser);
                  // e(err, tr(10));
                res.status("200").send({data: "register success"});
              } else {
                res.status("500").send({ data: "registration failed"});
              }
            } else {
              res.status("500").send({ data: "registration failed" });
            }
          });
        } else {
          l("User already defined");
          res.status("204").send({data:"user is already defined"});
        }
      } else {
        tr(getEmailErr);
        res.status("500").send({data:"Error getting user"});
      }
    });
  };

  return {
    register
  };
};


module.exports = registerController();