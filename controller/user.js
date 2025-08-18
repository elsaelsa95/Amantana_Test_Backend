const {User} = require("./../models")
const {compare} = require("./../helpers/bcrypt")
const {createToken} = require("./../helpers/jwt")
const Validator  = require('validatorjs')
const NodemailerHelper = require('nodemailer-otp');
const nodemailer = require('nodemailer')
require('dotenv').config();

let otp = ""

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
            
            // Initialize the helper
            const helper = new NodemailerHelper(process.env.EMAIL_USER, process.env.EMAIL_PASS);
            
            // Generate a 6-digit OTP
            otp = helper.generateOtp(6);
            
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            })
            
            const options = {
                from : process.env.EMAIL_USER,
                to : email,
                subject : 'Welcoming Email',
                text: `Your OTP code ${otp}`
            }

            return transporter.sendMail(options, (error,info) =>{
                if(error){
                    console.log(error)
                } 
                console.log(`success send mail to ${email}`)
            })

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
    static async verifyUser(req, res){
        try {
            const { email, inputOTP } = req.body;

            const findUser = await User.findOne({where:{email}});
            if (!findUser){
                return res.status(404).json({message: `Email Not Found`})
            }
            if (inputOTP !== otp){
                return res.status(401).json({message: `Invalid OTP`})
            }
            
            await findUser.update({verified: true})
            return res.status(200).json({message: "Your Account is Verified Now"})
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller