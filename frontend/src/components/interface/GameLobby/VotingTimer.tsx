import { useVotingTimer } from "../../../contexts/VotingContext";
import "../../../styles/lobby.css"

const VotingTimer = () => {
    const votingTimeRemaining = useVotingTimer();

    return (
        <p className="time_text">Time Left: {votingTimeRemaining.toFixed(1)}s</p>
    )
}

export default VotingTimer;