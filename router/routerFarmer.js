const router = require('express').Router();
const Controller = require("./../controller/farmer");
const authorization = require("../middleware/authorization")

router.get("/farmer", Controller.myPlant);
router.patch("/farmer/:id", authorization(["farmer"]), Controller.plantedDate);
router.post("/farmer/:id/treatment", authorization(["farmer"]), Controller.createTreatment)
router.get("/farmer/:id/treatment", authorization(["farmer"]), Controller.readTreatment)
router.patch("/farmer/:id/treatment", authorization(["farmer"]), Controller.updateTreatment)
router.delete("/farmer/:id/treatment", authorization(["farmer"]), Controller.deleteTreatment)

module.exports = router;