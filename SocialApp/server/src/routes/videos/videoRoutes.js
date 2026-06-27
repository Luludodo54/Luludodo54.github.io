const express = require("express");
const router = express.Router();
const controller = require("../../controllers/videos/videoController");

router.post("/upload", controller.uploadVideo);
router.get("/", controller.getVideos);

module.exports = router;
