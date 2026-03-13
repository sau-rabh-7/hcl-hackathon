import express from 'express';
const router = express.Router();

// Define a sample route
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

export default router;
