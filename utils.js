const jwt = require('jsonwebtoken');

module.exports = {
    validateToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        let result;
        if (authHeader) {
            const token = req.headers.authorization.split(' ')[1]; // bearer (token)
            const options = {
                expiresIn: '2d',
                issuer: 'Sample'
            };
            try {
                // verify makes sure that the token has not expired and has been issued by scotch.io
                result = jwt.verify(token, process.env.JWT_SECRET, options);

                // pass back the decoded token to the request object
                req.decoded = result;

                next();
            } catch (err) {
                throw new Error(err);
            }
        } else {
            result = {
                error: 'Authenticaiton error. Token required.',
                status: 401
            };
            res.status(401).send(result);
        }
    }
};