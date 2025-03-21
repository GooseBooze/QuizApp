require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Connect to MongoDB with more detailed error logging
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB at:', process.env.MONGODB_URI))
.catch(err => {
    console.error('MongoDB Connection Error:');
    console.error('Error:', err.message);
    console.error('Full error:', err);
    console.error('MONGODB_URI:', process.env.MONGODB_URI);
});

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        console.log('Fetching all quizzes...');
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        console.log('Found quizzes:', quizzes.length);
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Error fetching quizzes' });
    }
});

// Get a specific quiz
app.get('/api/quizzes/:id', async (req, res) => {
    try {
        console.log('Fetching quiz with ID:', req.params.id);
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            console.log('Quiz not found:', req.params.id);
            return res.status(404).json({ error: 'Quiz not found' });
        }
        console.log('Found quiz:', quiz.navn);
        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'Error fetching quiz' });
    }
});

// Create a new quiz
app.post('/api/quizzes', async (req, res) => {
    try {
        console.log('Creating new quiz:', req.body.navn);
        const quiz = new Quiz({
            navn: req.body.navn,
            questions: req.body.questions || []
        });
        await quiz.save();
        console.log('Created quiz with ID:', quiz._id);
        res.status(201).json(quiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Error creating quiz' });
    }
});

// Update a quiz
app.put('/api/quizzes/:id', async (req, res) => {
    try {
        console.log('Updating quiz:', req.params.id);
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!quiz) {
            console.log('Quiz not found for update:', req.params.id);
            return res.status(404).json({ error: 'Quiz not found' });
        }
        console.log('Updated quiz:', quiz.navn);
        res.json(quiz);
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ error: 'Error updating quiz' });
    }
});

// Delete a quiz
app.delete('/api/quizzes/:id', async (req, res) => {
    try {
        console.log('Deleting quiz:', req.params.id);
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            console.log('Quiz not found for deletion:', req.params.id);
            return res.status(404).json({ error: 'Quiz not found' });
        }
        console.log('Deleted quiz:', quiz.navn);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Error deleting quiz' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Environment:', {
        MONGODB_URI: process.env.MONGODB_URI,
        PORT: port
    });
});