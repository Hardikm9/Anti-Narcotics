const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo error:', err));

// Schema & Model
const reportSchema = new mongoose.Schema({
  report: String,
  timestamp: { type: Date, default: Date.now }
});
const Report = mongoose.model('Report', reportSchema);

// POST endpoint
app.post('/api/report', async (req, res) => {
  const { report } = req.body;
  if (!report) return res.status(400).json({ message: 'Report is required' });

  try {
    const saved = await new Report({ report }).save();
    res.status(200).json({ message: 'Report submitted anonymously' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
