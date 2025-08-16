const router = require('express').Router();
const Controller = require("./../controller/farmer");

router.get("/farmer", Controller.plant);

module.exports = router;