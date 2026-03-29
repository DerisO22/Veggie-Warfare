import { useEffect, useState } from "react";
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";
import SettingsMenu from "./SettingsMenu";
import { SignOutButton } from "@clerk/clerk-react";

const LobbyMenu = () => {
    const [ isSettingsVisible, setIsSettingsVisible ] = useState<boolean>(false);
    const [ isMusicOn, setIsMusicOn ] = useState<boolean>(true);

    // const handlePlayerExit = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     if(!socket) return;

    //     socket.emit("disconnect");
    // };

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

            scroll_reveal.reveal('.menu_button_container', {
                delay: 1000,
                origin: "top",
                interval: 300
            })
        }, 10);
    
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="lobby_menu_container">
                <div className="menu_button_container">
                    <button onClick={handleMusicToggle} className={`menu_button ${isMusicOn ? "music_toggle" : "muted_music_button"}`}></button>
                </div>
                
                <div className="menu_button_container">
                    <button onClick={handleSettingsToggle} className={`menu_button settings_toggle`}></button>
                </div>

                <div className="menu_button_container">
                    <SignOutButton>
                        <button className={`menu_button exit_toggle`}></button>
                    </SignOutButton>
                </div>
            </div>

            {isSettingsVisible && (
                <SettingsMenu toggleSettings={handleSettingsToggle} />
            )}
        </>
    );
}

export default LobbyMenu;