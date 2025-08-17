const router = require("express").Router();
const routerUser = require("./routerUser");
const routerFarmer = require("./routerFarmer");
const routerAgronomist = require("./routerAgronomist");
const routerPlant = require("./routerPlant")
const routerPost = require("./routerPost")
const authentication = require("./../middleware/aunthentication")
const authorization = require("./../middleware/authorization")

router.use(routerUser);

router.use(authentication)

router.use("/farmer", authorization(["admin", "farmer"]))
router.use(routerFarmer)

router.use("/agronomist",  authorization(["admin", "agronomist"]))
router.use(routerAgronomist)

router.use(routerPlant)

router.use(routerPost)

module.exports = router;