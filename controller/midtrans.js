const Midtrans = require("midtrans-client")
const { Saldo, User } = require("./../models")
const { v4: uuidv4 } = require('uuid');

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY_MIDTRANS,
    clientKey: process.env.CLIENT_KEY_MIDTRANS
})

let userId = ""

class Controller {
    static async midtrans(req,res){
        try {
            const { gross_amount} = req.body
            userId = req.user.id

            let parameter = {
                transaction_details: {
                    order_id : uuidv4(), 
                    gross_amount
                },
                customer_details: {
                    first_name: req.user.username,
                }
            }
            const token = await snap.createTransactionToken(parameter)

            return res.status(201).json({ message : `Midtrans_token : ${token}, redirect_url : https://app.sandbox.midtrans.com/snap/v3/redirection/${token}`})
            // go to payment link to complete transaction
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } 
    static async notification(req,res) {
        try {
            const notificationJson = req.body;
            const status = await notificationJson

            if (status.transaction_status === "settlement" || status.transaction_status === "capture"){
                const saldo = await Saldo.create({
                    UserId: userId,
                    orderId: status.order_id,
                    nominal: parseInt(status.gross_amount),
                    status: "top-up"
                })

                const checkBalance = await User.findOne({where: {id: userId}})

                const updateBalance = await checkBalance.update({
                    balance: checkBalance.balance + (parseInt(status.gross_amount/10))
                })

                return res.status(200).json({ message: "OK" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = Controller