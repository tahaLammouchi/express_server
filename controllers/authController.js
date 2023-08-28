const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if(!username || !password) {
        res.status(400).json({message: 'Username and password are required'});
        return;
    }
    // check if username exists in the database
    const foundUser = await User.findOne({username: username}).exec();
    if(!foundUser) {
        res.sendStatus(401); // unauthorized
        return;
    }
    console.log(foundUser);
    // check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if(isPasswordCorrect) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30m'}
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        // store the refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        // send the access token and store the refresh token in cookie
        res.cookie('refreshToken', refreshToken, {httpOnly: true, sameSite:'None', maxAge: 24 * 60 * 60 * 1000});
        res.json({ accessToken });
        return;
    }
    else {
        res.sendStatus(401); // unauthorized
        return;
    }
    

}

module.exports = { handleLogin };