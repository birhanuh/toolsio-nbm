import express from 'express';
import path from 'path'
let router = express.Router();

// Get Homepage
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

module.exports = router;