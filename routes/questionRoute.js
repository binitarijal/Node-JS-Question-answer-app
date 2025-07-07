const router=require("express").Router();

const {multer, storage} = require('../middleware/multerConfig'); // Import the multer library for handling file uploads
const upload = multer({ storage: storage }); // Configure multer with the specified storage settings

const { renderAskQuestionPage, askQuestion, renderSingleQuestionPage } = require("../controllers/questionController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const catchError = require("../utils/catchError");

router.route('/askQuestion').post( isAuthenticated,  upload.single('image'),catchError(askQuestion)).get(catchError(renderAskQuestionPage));
router.route('/questions/:id').get( catchError(renderSingleQuestionPage)); // Route to render a single question page
module.exports=router;