const { User } = require("../models")

const authorization = (roles = []) => {
    return async (req,res, next) => {
        try {
            const id = req.user.id
            const findId = await User.findOne({where:{id}})

            if(!findId){
                res.status(404).json({ message: `Data Not Found` });
            }

            if (!roles.includes(req.user.role)) {
                res.status(403).json({ message: `Forbidden` });
            }
            next()
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: `Internal Server Error` });
        }
    }
}

module.exports = authorization