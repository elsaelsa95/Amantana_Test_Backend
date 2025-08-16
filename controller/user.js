const {User} = require("./../models")
const {compare} = require("./../helpers/bcrypt")
const {createToken} = require("./../helpers/jwt")
const Validator  = require('validatorjs')

class Controller {
    static async register(req,res){
        try {
            const {email, password, username, role} = req.body;

            const data = {email, password, username, role}
            const rules = {
                email: 'required|email',
                password: 'required',
                username: 'required',
                role:'required'
            }

            const validation = new Validator(data,rules)

            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }
           
            const findUser = await User.findOne({where:{email}});
            if (findUser){
               return res.status(401).json({message: `Email already used`})
            }
            const createUser = await User.create({email, password, username,role});
            res.status(201).json({message: `${createUser.username} has been created as ${createUser.role}`});
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async login(req, res) {
        try {
            const {email, password} = req.body;

            const data = {email, password}
            const rules = {
                email: 'required|email',
                password: 'required',
            }

            const validation = new Validator(data,rules)

            if (validation.fails()){
                return res.status(400).json(validation.errors.all());
            }

            const findUser = await User.findOne({where:{email}});
            if (!findUser){
                return res.status(401).json({message: `Invalid Email or Password`})
            }
            const checkPassword = compare(password, findUser.password);
            if (!checkPassword){
               return res.status(401).json({message: `Invalid Email or Password`})
            }
            const payload = { id: findUser.id}
            const accessToken = createToken(payload)

            res.status(200).json({accessToken, findUser})
        }
        catch(error){
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller