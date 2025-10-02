const router = require("express").Router();
const {
  addCourses,
  updateCourse,
  deleteCourse,
  getCourses,
  getCourse,
} = require("../controllers/courseController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/createCourse", upload.single("image"), addCourses);
router.get("/getAllCourses", getCourses);
router.get("/getCourse/:id", getCourse);
router.put("/updateCourse/:id", upload.single("image"), updateCourse);
router.delete("/deleteCourse/:id", deleteCourse);

module.exports = router;
