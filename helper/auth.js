const jwt = require('jsonwebtoken')

const createToken = (data) =>{
    const token = jwt.sign({ data }, process.env.TOKEN_KEY, { expiresIn: "1h"})
    return token
}

const verifyToken = (token) =>{
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded
}

module.exports = { createToken, verifyToken }
