const { verifyJWT } = require("./jwtToken");

exports.deserializeUser = (req, res, next) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return next();
    }
    const { payload } = verifyJWT(accessToken);
    if (payload) {
        req.user = payload;
        return next();
    }
    return next();
}

exports.requireUser = (req, res, next) => {
    if (!req.user) {
        return res.status(403).send("invalid session");
    }
    return next();
}