const express = require('express');
const mongoose = require('mongoose');
const User = require('./src/User');
const authRouter = require('./src/auth');
const authMiddleware = require('./src/authMiddleware');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const cors = require('cors');
const app = express();
// Enable CORS - allow all origins for development, or set specific origin via ORIGIN env var
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// MongoDB connection - use MONGO_URI when running in Docker
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/practica4';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Mongo connection error:', err));

app.post('/users', async (req, res) => {
  try {
    const data = req.body;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const user = new User(data);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use('/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;