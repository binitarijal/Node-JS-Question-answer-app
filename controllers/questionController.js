

const { where } = require("sequelize");
const { questions, users, answers } = require("../model/index"); // Import the questions and users models
exports.renderAskQuestionPage=(req,res)=>{
    res.render("questions/askQuestions"); // Render the 'askQuestions' view
}

exports.askQuestion=async(req,res)=>{
    const {title,description}= req.body; // Destructure the request body to get title and description
    
    //console.log(req.body); // Log the request body to the console
    const userId=req.userId; // Get the user ID from the request object
    const fileName=req.file.filename; // Get the filename of the uploaded image from the request file
    if(!title || !description){ // Check if any of the fields are empty
        return res.status(400).send("All fields are required!"); // If any field is empty, send a 400 status with an error message
    }
    await questions.create({
        title,
        description,
        userId, // Save the user ID of the person asking the question
        image:fileName, // Save the filename of the uploaded image
    })
    res.redirect("/"); // Redirect to the home page after successfully asking a question
}

exports.getAllQuestions=async(req,res)=>{
    const data=await questions.findAll({
        include: [
            { model: users }
        ]
    })
}

exports.renderSingleQuestionPage=async(req,res)=>{
    const { id } = req.params; // Get the question ID from the request parameters
    const data = await questions.findAll( {
        where: { id }, // Find the question with the given ID
        include: [
            { model: users } // Include the user who asked the question
        ]
    });
    console.log(data); // Log the retrieved question data to the console
    
    if (!data) { // If no question is found with the given ID
        return res.status(404).send("Question not found!"); // Send a 404 status with an error message
    }
    const answersData = await answers.findAll({
        where: { questionId: id }, // Find answers related to the question with the given ID
        include: [
            { model: users,
                attributes: ['username'] // Include the username of the user who answered the question
             } // Include the user who answered the question
        ]
    });
      if (!data || data.length === 0) {
        return res.status(404).send("Question not found!");
    }
    res.render("questions/singleQuestion",{data,answers:answersData}); // Render the 'singleQuestion' view

}