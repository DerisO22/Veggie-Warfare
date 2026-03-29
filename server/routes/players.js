import express from 'express';
import { getAllPlayerInformation } from '../services/playersService';

const router = express.Router();

router.get('/:clerk_user_id', async(req, res) => {
    try {
        const { clerk_user_id } = req.params;

        const result = await getAllPlayerInformation(req.pgClient, clerk_user_id);

        if(result.length === 0){
            return res.status(404).json({ error: "Player Not Found"});
        }

        res.json(result);
    } catch (err) {
        console.error('Error fetching player data:', err);
        res.status(500).json({ error: err.message });
    }   
});

export default router;