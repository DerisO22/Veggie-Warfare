import { useEffect, useState } from "react";
import { useSocket } from "../../../contexts/useSocket";
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import SettingsMenu from "./SettingsMenu";

const LobbyMenu = () => {
    const { socket } = useSocket();
    const [ isSettingsVisible, setIsSettingsVisible ] = useState<boolean>(false);
    const [ isMusicOn, setIsMusicOn ] = useState<boolean>(true);

    const handlePlayerExit = (e: React.MouseEvent) => {
        e.preventDefault();
        if(!socket) return;

        socket.emit("disconnect");
    };

    const handleMusicToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMusicOn(prev => !prev);

        // some logic for toggling music. This could prob be some global state
    }

    const handleSettingsToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSettingsVisible(prev => !prev);

        // some logic for saving settings. This could prob be some global state
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            scroll_reveal.reveal('.lobby_menu_container', { origin: 'top', delay: 1000 });
          }, 10);
        
          return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="lobby_menu_container">
                <div onClick={handlePlayerExit} className="menu_button exit_toggle"></div>
                <button onClick={handleMusicToggle} className={`menu_button music_toggle ${!isMusicOn ? 'muted_music_button' : ''}`}></button>
                <button onClick={handleSettingsToggle} className={`menu_button settings_toggle`}></button>
            </div>        
            {isSettingsVisible && (
                <SettingsMenu toggleSettings={handleSettingsToggle} />
            )}
        </>
    );
}

export default LobbyMenu;