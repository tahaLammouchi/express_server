const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.refreshToken) { 
        res.sendStatus(401);  // unauthorized
        return;
    }
    console.log(cookies.refreshToken);
    const refreshToken = cookies.refreshToken;

    // check if username already exists in the database
    const foundUser = await User.findOne({refreshToken: refreshToken}).exec();
    if(!foundUser) {
        res.sendStatus(403); // forbidden
        return;
    }
    // check if the refresh token is valid
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || decoded.username !== foundUser.username) {
                res.sendStatus(403); // forbidden
                return;
            }
            // create new access token
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo:": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30m'}
            );
            res.json({ accessToken });
            return;
        }
    )

}

module.exports = { handleRefreshToken };