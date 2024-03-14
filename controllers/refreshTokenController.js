const User = require('../modal/UserSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    try {
        const cookies = req.cookies;
        console.log(cookies);
        if (!cookies?.jwt) return res.status(401).json({ "message": "no cookies found" });
        const refreshToken = cookies.jwt;

        const foundUser = await User.findOne({ user_refreshToken: refreshToken });
        
        if (!foundUser) return res.status(401).json({ "message": "user not found in UserSchema" });
        
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.user_username !== decoded.username) return res.status(401).send();

                const roles = foundUser.user_roles;
                console.log(`REFRESH TOKEN ROLES ${roles}`);

                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": foundUser.user_username,
                            "roles": roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' }
                );

                res.status(200).json({ roles, accessToken });
            }
        );
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleRefreshToken };
