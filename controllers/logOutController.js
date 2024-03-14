const User = require('../modal/UserSchema');

const handleLogOut = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;
    try {
        const foundUser = await User.findOne({ user_refreshToken: refreshToken });
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            return res.sendStatus(204);
        }

        foundUser.user_refreshToken = '';
        const result = await foundUser.save();
        console.log(result);

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }).sendStatus(204);
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleLogOut };
