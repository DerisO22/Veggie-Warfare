CREATE TABLE IF NOT EXISTS players (
    clerk_user_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS player_keybinds (
    keybinds_id SERIAL PRIMARY KEY,
    
    "forward" VARCHAR(10) NOT NULL DEFAULT 'w',
    "backward" VARCHAR(10) NOT NULL DEFAULT 's',
    "left" VARCHAR(10) NOT NULL DEFAULT 'a',
    "right" VARCHAR(10) NOT NULL DEFAULT 'd',
    "jump" VARCHAR(10) DEFAULT ' ',
    "ability1" VARCHAR(10) NOT NULL DEFAULT 'e',
    "ability2" VARCHAR(10) NOT NULL DEFAULT 'shift',

    clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (clerk_user_id) REFERENCES players(clerk_user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS player_stats (
    stats_id SERIAL PRIMARY KEY,
    clerk_user_id VARCHAR(255) NOT NULL UNIQUE,
    
    player_kills INTEGER DEFAULT 0,
    player_deaths INTEGER DEFAULT 0,
    player_wins INTEGER DEFAULT 0,
    player_losses INTEGER DEFAULT 0,
    total_games_played INTEGER DEFAULT 0,

    FOREIGN KEY (clerk_user_id) REFERENCES players(clerk_user_id) ON DELETE CASCADE
);