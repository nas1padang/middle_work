
const { verifyToken } = require('./auth')

const authorizationChecker = (req, res, next) => {
    
    const getToken = req.headers['x-token-key'];

    try {
        verifyToken(getToken);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    next()
}

module.exports = authorizationChecker