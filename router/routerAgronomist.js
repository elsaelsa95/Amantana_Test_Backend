const router = require('express').Router();
const Controller = require("./../controller/agronomist");

router.get("/agronomist", Controller.plant);

module.exports = router;