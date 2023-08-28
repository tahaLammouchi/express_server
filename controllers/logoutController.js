const User = require('../models/User');

const handleLogout = async (req, res) => {
    //!! On client, also delete the access token !!!!!!

    const cookies = req.cookies;
    if(!cookies?.refreshToken){
        res.sendStatus(204); // no content
        return;
    }
    const refreshToken = cookies.refreshToken;
    // if refreshToken in db?
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec();
    if(!foundUser) {
        res.clearCookie('refreshToken', {httpOnly: true, sameSite:'None'});
        res.sendStatus(204); // no content
        return;
    }
    // remove refreshToken from db
    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log(result);
    // remove refreshToken from cookie
    res.clearCookie('refreshToken', {httpOnly: true, sameSite:'None'});
    res.sendStatus(204); // no content
}

module.exports = { handleLogout };
