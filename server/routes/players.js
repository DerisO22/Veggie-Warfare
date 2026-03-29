import express from 'express';
import { getAllPlayerInformation, savePlayerInformation } from '../services/playersService.js';

const router = express.Router();

router.get('/:clerk_user_id', async(req, res) => {
    try {
        const { clerk_user_id } = req.params;

        const result = await getAllPlayerInformation(req.pgClient, clerk_user_id);

        if(!result){ 
            return res.status(404).json({ error: "Player Not Found"});
        }

        res.json(result);
    } catch (err) {
        console.error('Error fetching player data:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:clerk_user_id', async(req, res) => {
    try {
        const { clerk_user_id } = req.params;
        const playerData = req.body;

        // Validate clerk_user_id matches
        if (playerData.player_clerk_id !== clerk_user_id) {
            return res.status(400).json({ error: "Clerk ID mismatch" });
        }

        await savePlayerInformation(req.pgClient, playerData);
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error saving player data:', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;