const { verifyToken } = require("./../helpers/jwt");
const { User } = require('./../models');

const authentication = async (req, res, next) => {
    try {
        const { acesstoken } = req.headers;

        if (!acesstoken) {  
            return res.status(401).json({ message: `Error authentication1` });
        }
  
        const payload = verifyToken(acesstoken) 
  
        const user = await User.findByPk(payload.id)
        if (!user) {
            return res.status(401).json({ message: `Error authentication2` });
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