const router = require("express").Router();
const courseRoute = require("./courseRoute.js");
const cartRoute = require("./cartRoute.js");
const authRoute = require("./authRoute.js")

router.use("/allCourses", courseRoute);
router.use("/allCartCourses", cartRoute);
router.use("/auth", authRoute)

module.exports = router;
