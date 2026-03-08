interface GameChatPropsType {
    handle_toggle: (e: React.MouseEvent) => void,
}

const GameChatToggle = ({handle_toggle}: GameChatPropsType) => {
    return (
        <div className="game_chat_toggle_container">
            <button onClick={handle_toggle} className='game_chat_toggle_button'></button>
        </div>
    )
}

export default GameChatToggle
