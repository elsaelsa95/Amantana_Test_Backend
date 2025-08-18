const router = require('express').Router();
const Controller = require("./../controller/farmer");
const ControllerMidtrans = require("./../controller/midtrans")
const authorization = require("../middleware/authorization")

router.get("/farmer", Controller.myPlant);
router.patch("/farmer/:id", authorization(["farmer"]), Controller.plantedDate);
router.post("/farmer/:id/treatment", authorization(["farmer"]), Controller.createTreatment)
router.get("/farmer/:id/treatment", authorization(["farmer"]), Controller.readTreatment)
router.patch("/farmer/:id/treatment", authorization(["farmer"]), Controller.updateTreatment)
router.delete("/farmer/:id/treatment", authorization(["farmer"]), Controller.deleteTreatment)

router.post("/farmer/:id/growth", authorization(["farmer"]), Controller.createGrowthLog)
router.get("/farmer/:id/growth", authorization(["farmer"]), Controller.readGrowthLog)
router.get("/farmer/:id/growthPeriod", authorization(["farmer"]), Controller.readGrowthLogByPeriod)
router.post("/farmer/compareGrowth", authorization(["farmer"]), Controller.compareGrowth)
router.get("/farmer/top5", Controller.top5)

router.post("/farmer/midtrans", authorization(["farmer"]), ControllerMidtrans.midtrans)

module.exports = router;