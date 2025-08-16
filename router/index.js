const router = require("express").Router();
const routerUser = require("./routerUser");

router.use(routerUser);

module.exports = router;