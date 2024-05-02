const Users = require("../db/db").Users;
async function emailVerify(email){
    const user = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      url = "/register" 
    } else {
      url = "/login-success"
    }
    return url
}
module.exports.emailVerify = emailVerify;