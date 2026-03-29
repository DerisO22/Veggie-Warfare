import type { PlayerDataType } from "../contexts/PlayerContext";

const API_URL: string = (import.meta.env.VITE_NODE_ENVIRONMENT === "production") ? 
    import.meta.env.VITE_PROD_URL :
    import.meta.env.VITE_DEV_URL;

// Just for one player not every
export const getAllPlayerInformation = async(player_clerk_id: string) => {
    try {
        const res = await fetch(`${API_URL}/players/${player_clerk_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json "},
            credentials: 'include',
        })

        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(`API error (${res.status}): ${errorText || 'Unknown error'}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error in getAllPlayerInformation service ", err);
        throw err;
    }   
}

export const savePlayerInformation = async(player_data: PlayerDataType) => {
    try {
        const res = await fetch(`${API_URL}/players/${player_data.player_clerk_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json "},
            credentials: 'include',
            body: JSON.stringify(player_data)
        })

        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(`API error (${res.status}): ${errorText || 'Unknown error'}`);
        }

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error in getAllPlayerInformation service ", err);
        throw err;
    }   
}