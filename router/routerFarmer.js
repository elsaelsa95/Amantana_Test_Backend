const router = require('express').Router();
const Controller = require("./../controller/farmer");

router.get("/farmer", Controller.myPlant);
router.patch("/farmer/:id", Controller.plantedDate)

module.exports = router;