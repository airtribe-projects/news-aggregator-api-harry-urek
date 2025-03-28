const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;


const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied . No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid Token or Expired Token" });
    }
};



const hashPassword = async (req, res, next) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: "Password is required" });
        }

        req.body.password = await bcrypt.hash(req.body.password, 10);
        next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { authenticateToken, hashPassword }; 
