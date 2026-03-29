import { playerQueries, UPSERT_PLAYER, UPSERT_PLAYER_KEYBINDS, UPSERT_PLAYER_SOUNDS, UPSERT_PLAYER_STATS } from "../database/queries/playerQueries.js";

export const getAllPlayerInformation = async(pgClient, clerk_user_id) => {
    try {
        const query = playerQueries.GET_ALL_PLAYER_INFORMATION;
        const result = await pgClient.query(query, [clerk_user_id]);

        if (result.rows.length === 0) return null;

        const row = result.rows[0];

        return {
            player_clerk_id: row.clerk_user_id,
            player_keybinds: {
                forward: row.forward,
                backward: row.backward,
                left: row.left,
                right: row.right,
                jump: row.jump,
                ability1: row.ability1,
                ability2: row.ability2
            },
            player_stats: {
                stats_id: row.stats_id,
                player_kills: row.player_kills,
                player_deaths: row.player_deaths,
                player_wins: row.player_wins,
                player_losses: row.player_losses,
                total_games_players: row.total_games_played
            },
            player_sounds: {
                music: row.music,
                sfx: row.sfx,
                other: row.other
            }
        };
    } catch (err) {
        console.error("Service Error fetching all player information: ", err);
        throw err;
    }
}

export const savePlayerInformation = async(pgClient, playerData) => {
    try {
        const { player_clerk_id, player_keybinds, player_sounds, player_stats } = playerData;
        
        // Upsert all tables
        await pgClient.query(playerQueries.UPSERT_PLAYER, [player_clerk_id, 'Player']); 
        
        await pgClient.query(playerQueries.UPSERT_PLAYER_KEYBINDS, [
            player_clerk_id,
            player_keybinds.forward,
            player_keybinds.backward,
            player_keybinds.left,
            player_keybinds.right,
            player_keybinds.jump,
            player_keybinds.ability1,
            player_keybinds.ability2
        ]);
        
        await pgClient.query(playerQueries.UPSERT_PLAYER_SOUNDS, [
            player_clerk_id,
            player_sounds.music,
            player_sounds.sfx,
            player_sounds.other
        ]);
        
        await pgClient.query(playerQueries.UPSERT_PLAYER_STATS, [
            player_clerk_id,
            player_stats.player_kills,
            player_stats.player_deaths,
            player_stats.player_wins,
            player_stats.player_losses,
            player_stats.total_games_played
        ]);

        return { success: true };
    } catch (err) {
        console.error("Service Error saving player information: ", err);
        throw err;
    }
}