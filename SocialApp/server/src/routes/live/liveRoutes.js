const express = require("express");
const router = express.Router();

const controller = require("../../controllers/live/liveController");

router.post("/start", controller.startLive);
router.post("/stop", controller.stopLive);
router.get("/:liveId", controller.getLive);

module.exports = router;
