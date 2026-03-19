import { get_map_vote_path } from "../../../utils/helpers/getMapPath";
import { useVoting } from "../../../contexts/VotingContext";

// Just for testing now
const maps = [
    {
        map_name: "Valley",
        map_votes: 4,
    },
    {
        map_name: "Volcano",
        map_votes: 2,
    },
    {
        map_name: "Everest",
        map_votes: 8,
    }
]

const Voting = () => {
    const { isVotingActive, votes, mapWinner, handle_player_vote } = useVoting();

    return (
        <>
            {isVotingActive && (
                <div className="voting_interface_container">
                    <h1 className="vote_header1">Map Voting</h1>
                    <p className="time_text">Time Left: 30.0s</p>

                    <div className="map_cards_container">
                        {maps.map((map_data, index) => (
                            <div style={{ backgroundImage: `url(${get_map_vote_path(map_data.map_name)})`}} 
                                onClick={(e) => handle_player_vote(e, map_data.map_name)} 
                                className="map_vote_card" 
                                key={index}
                            >
                                <h1 className="map_header">{map_data.map_name}</h1>
                                <p className="vote_card_header1">Total Votes</p>
                                <p className="vote_card_text">{map_data.map_votes}</p>
                            </div>
                        ))}
                    </div>
                </div>  
            )}
        </>
    )
}

export default Voting; 