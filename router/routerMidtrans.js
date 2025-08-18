const router = require('express').Router();

const ControllerMidtrans = require("./../controller/midtrans")

router.post("/midtrans/notification", ControllerMidtrans.notification) //use ngrok to trigger

/*
1. go to Midtrans dashboard
2. open settings
3. open Payment
4. setting Payment notification URL with your ngrok url (example: https://random1234.ngrok-free.app/midtrans/notification)
5. save
*/

module.exports = router;