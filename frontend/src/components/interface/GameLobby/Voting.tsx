import { get_map_vote_path } from "../../../utils/helpers/getMapPath";
import { useVoting, Maps } from "../../../contexts/VotingContext";
import { memo } from "react";
import { useCurrentGameState } from "../../../contexts/CurrentGameState";
import VotingTimer from "./VotingTImer";

const Voting = () => {
    const {
        hasVotingEnded,
        votes,
        mapWinner,
        handle_player_vote,
        isVotingVisible,
        toggleVotingVisibility
    } = useVoting();

    const currentGameState = useCurrentGameState();

    // Convert votes to the maps array format for display
    const mapsWithVotes = Object.entries(Maps).map(([mapKey, mapName]) => ({
        map_key: mapKey,
        map_name: mapName,
        map_votes: votes[mapKey as keyof typeof votes] || 0
    }));

    return (
        <>
            {isVotingVisible && (
                <>
                    {currentGameState === "VOTING" && (
                        <div className="voting_interface_container">
                            <h1 className="vote_header1">Map Voting</h1>
                            <VotingTimer />

                            <div className="map_cards_container">
                                {mapsWithVotes.map((map_data) => (
                                    <div 
                                        style={{ backgroundImage: `url(${get_map_vote_path(map_data.map_name)})` }} 
                                        onClick={(e) => handle_player_vote(e, map_data.map_name)} 
                                        className="map_vote_card" 
                                        key={map_data.map_key}
                                    >
                                        <h1 className="map_header">{map_data.map_name}</h1>
                                        <p className="vote_card_header1">Total Votes</p>
                                        <p className="vote_card_text">{map_data.map_votes}</p>
                                    </div>
                                ))}
                            </div>
                        </div>  
                    )}

                    {hasVotingEnded && mapWinner && (
                        <div className="voting_interface_container">
                            <h1 className="vote_header1">Voting Complete!</h1>
                            <p className="vote_card_header1">Winner: {Maps[mapWinner as keyof typeof Maps]}</p>
                        </div>
                    )}

                    <button className="return_to_lobby_button" onClick={toggleVotingVisibility}>
                        Back to Lobby
                    </button>
                </>
            )}
        </>
    )
}

export default memo(Voting);