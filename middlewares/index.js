

const jwt = require('jsonwebtoken');
const authorization = (req, res, next) => {
    const secret = 'hidden'
    const token = req.headers['authorization'];

    if (!token) {
        return res.json({ status:401, message: 'Authorization Required'})
    } 
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.json({ message: 'Token is invalid / '+ err.message })
        }
        req.user = decoded.user
        next();
})

}

module.exports = authorization;