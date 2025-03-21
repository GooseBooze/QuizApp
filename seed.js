require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz'); // Adjust the path to your Quiz model

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    return Quiz.deleteMany(); // Clear existing data
  })
  .then(() => {
    // Add initial quiz data
    return Quiz.insertMany([
      { navn: 'Sample Quiz 1', questions: [{ question: 'What is 2 + 2?', answers: ['3', '4', '5'], correctAnswers: [1] }] },
      { navn: 'Sample Quiz 2', questions: [{ question: 'What is the capital of France?', answers: ['Berlin', 'Madrid', 'Paris'], correctAnswers: [2] }] },
    ]);
  })
  .then(() => {
    console.log('Database seeded');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error during seeding:', err);
    mongoose.connection.close();
  });