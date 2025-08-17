const router = require('express').Router();
const Controller = require("./../controller/post");

router.post("/post", Controller.createPost);
router.get("/post", Controller.readAllPost);
router.get("/post/:id", Controller.readPostById);
router.put("/post/:id", Controller.updatePostById);
router.delete("/post/:id", Controller.deletePostById);

module.exports = router;