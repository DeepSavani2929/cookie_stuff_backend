const {
  deleteCartCourse,
  addToCart,
  getCartCourses,
} = require("../controllers/cartController");

const router = require("express").Router();

router.get("/getAllCoursesAvailableIntoCart", getCartCourses);
router.post("/addIntoTheCart/:id", addToCart);
router.delete("/deleteOneCourseFromCart/:id", deleteCartCourse);
module.exports = router;
