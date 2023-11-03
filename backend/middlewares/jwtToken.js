const jwt = require('jsonwebtoken');
const acccessSecret = 'access-token-secret';
const refreshSecret = 'refresh-token-secret';

exports.signJWT = (payload, expiresIn) => {
    return jwt.sign(payload, acccessSecret, { expiresIn })
}

exports.verifyJWT = (token) => {
    try {
        const decoded = jwt.verify(token, acccessSecret);
        return { payload: decoded, expired: false }
    } catch (error) {
        return { payload: null, expired: error.message.include("jwt expired") }
    }
}


exports.verifyToken = (req, res, next) => {
    if (req.cookies?.jwt) {
        const refreshToken = req.cookies.jwt;
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                else {
                    const accessToken = jwt.sign({
                        username: userCredentials.username,
                        email: userCredentials.email
                    }, process.env.ACCESS_TOKEN_SECRET, {
                        expiresIn: '10m'
                    });
                    return res.json({ accessToken });
                }
            })
    } else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
};

exports.initToken = (userid) => {
    const accessToken = jwt.sign({ userId: savedUser._id }, 'access-token-secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: savedUser._id }, 'refresh-token-secret', { expiresIn: '1d' });

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None', secure: false,
        maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ accessToken });
}