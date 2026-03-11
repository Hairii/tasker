import cookieParser from 'cookie-parser';
import jsw from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (!token) {
        return res.status(401).json({ message : "token manquant"});
    }
    jsw.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message : "token invalide"});
        }
        req.user = decoded;
        next();
    })
};