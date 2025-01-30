const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api', authRoutes);
app.use('/api', contactRoutes);

// MongoDB Connection
mongoose.connect('mongodb+srv://jindalakash238:idY78V748GBiGk4f@cluster0.anctu.mongodb.net/userAuthenticationProjectDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
