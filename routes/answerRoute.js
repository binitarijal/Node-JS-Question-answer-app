const router=require("express").Router();
const { isAuthenticated } = require("../middleware/isAuthenticated"); // Import the authentication middleware
const { handleAnswer } = require("../controllers/answerController");
const catchError = require("../utils/catchError");
router.route('/:id').post(isAuthenticated,catchError(handleAnswer)); // Route to handle answer submission
module.exports=router; // Export the router to be used in the main application