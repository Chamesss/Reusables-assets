const jwt = require('jsonwebtoken');

const signToken = (user, secret, expiresIn) => {
    return jwt.sign(
        {
            userId: user._id || user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
        },
        secret,
        {
            expiresIn,
        }
    );
};

exports.signAccessJWT = (user) => {
    return signToken(user, process.env.ACCESS_SECRET, '5m');
};

exports.signRefreshJWT = (user) => {
    return signToken(user, process.env.REFRESH_SECRET, '1d');
};

exports.verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    console.log(token)
    jwt.verify(
        token,
        process.env.ACCESS_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded;
            next();
        }
    );
}

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies['refreshToken'];
    console.log(refreshToken)
    if (!refreshToken) {
        return res.status(401).send('Access Denied. No token provided.');
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        req.user = decoded;
        const accessToken = signToken(decoded, process.env.ACCESS_SECRET, '5m');
        res.json({ accessToken })
    } catch (error) {
        return res.status(400).send('Invalid Token.');
    }
}