export const playerQueries = {
    GET_ALL_PLAYER_INFORMATION: 
        `SELECT *
        FROM players p
        JOIN player_keybinds pk ON p.clerk_user_id = pk.clerk_user_id
        JOIN player_stats pst ON p.clerk_user_id = pst.clerk_user_id
        JOIN player_sounds pso ON p.clerk_user_id = pso.clerk_user_id
        WHERE p.clerk_user_id = $1;`,
    
    /**
     * For the save player info
     */
    UPSERT_PLAYER: 
        `INSERT INTO players (clerk_user_id, username)
        VALUES ($1, $2)
        ON CONFLICT (clerk_user_id) 
        DO UPDATE SET username = $2
        RETURNING *;`,
    
    UPSERT_PLAYER_KEYBINDS:
        `INSERT INTO player_keybinds (clerk_user_id, forward, backward, left, right, jump, ability1, ability2)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (clerk_user_id)
        DO UPDATE SET forward = $2, backward = $3, left = $4, right = $5, jump = $6, ability1 = $7, ability2 = $8
        RETURNING *;`,
    
    UPSERT_PLAYER_SOUNDS:
        `INSERT INTO player_sounds (clerk_user_id, music, sfx, other)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (clerk_user_id)
        DO UPDATE SET music = $2, sfx = $3, other = $4
        RETURNING *;`,
    
    UPSERT_PLAYER_STATS:
        `INSERT INTO player_stats (clerk_user_id, player_kills, player_deaths, player_wins, player_losses, total_games_played)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (clerk_user_id)
        DO UPDATE SET player_kills = $2, player_deaths = $3, player_wins = $4, player_losses = $5, total_games_played = $6
        RETURNING *;`
}