const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    answers: [{
        type: String,
        required: true
    }],
    correctAnswers: [{
        type: Number,
        required: true,
        min: 1,
        max: 4
    }]
});

const QuizSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    imageUrl: {
        type: String,
        required: false,
        default: ""
    },
    questions: [QuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);
