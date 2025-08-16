const router = require('express').Router();
const Controller = require("../controller/plant");
const authorization = require("../middleware/authorization")

router.post("/plants", authorization(["admin"]), Controller.createPlant);
router.get("/plants", authorization(["admin", "farmer", "agronomist"]), Controller.readPlant)
router.get("/plants/:id", authorization(["admin", "farmer", "agronomist"]), Controller.readPlantById)
router.put("/plants/:id", authorization(["admin"]), Controller.updatePlantById)
router.delete("/plants/:id", authorization(["admin"]), Controller.deletePlantById)

router.patch("/plants/:id", authorization(["farmer"]), Controller.addingPlantForFarmer)

module.exports = router;