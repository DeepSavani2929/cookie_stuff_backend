const {
  deleteCartCourse,
  addToCart,
  getCartCourses,
  incrementQuantity,
  decrementQuantity,
} = require("../controllers/cartController");

const authorization = require("../middleware/authorization");

const router = require("express").Router();

router.get("/getAllCoursesAvailableIntoCart", authorization, getCartCourses);
router.post("/addIntoTheCart/:id", authorization, addToCart);
router.delete("/deleteOneCourseFromCart/:id", authorization, deleteCartCourse);
router.put("/incrementQuantity/:id", authorization, incrementQuantity);
router.put("/decrementQuantity/:id", authorization, decrementQuantity);

module.exports = router;
