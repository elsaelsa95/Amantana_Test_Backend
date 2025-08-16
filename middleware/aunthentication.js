const { verifyToken } = require("./../helpers/jwt");
const { User } = require('./../models');

const authentication = async (req, res, next) => {
    try {
        const { accesstoken } = req.headers;

        if (!accesstoken) {  
            return res.status(401).json({ message: `Error authentication` });
        }
  
        const payload = verifyToken(accesstoken) 
  
        const user = await User.findByPk(payload.id)
        if (!user) {
            return res.status(401).json({ message: `Error authentication` });
        }
      
        req.user ={
            id: user.id,
            email:user.email,
            username: user.username,
            role:user.role
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: `Internal Server Error` });
    }
}

module.exports = authentication