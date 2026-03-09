interface GameChatPropsType {
    handle_toggle: (e: React.MouseEvent) => void,
    isVisible: boolean,
}

const GameChatToggle = ({handle_toggle, isVisible}: GameChatPropsType) => {
    return (
        <div className="game_chat_toggle_container">
            <button 
                onClick={handle_toggle} 
                className='game_chat_toggle_button'
                style={{
                    width: `${isVisible ? "1.8rem" : "2.8rem"}`,
                    height: `${isVisible ? "1.8rem" : "2.8rem"}`
                }}
            />
        </div>
    );
}

export default GameChatToggle;