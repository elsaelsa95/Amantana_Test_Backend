const { User } = require("../models")

const authorization = (roles = []) => {
    return async (req,res, next) => {
        try {
            const id = req.user.id
            const findId = await User.findOne({where:{id}})

            if(!findId){
                return res.status(404).json({ message: `Data Not Found` });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: `Forbidden` });
            }
            next()
        } catch (error) {
            return res.status(500).json({ message: `Internal Server Error` });
        }
    }
}

module.exports = authorization