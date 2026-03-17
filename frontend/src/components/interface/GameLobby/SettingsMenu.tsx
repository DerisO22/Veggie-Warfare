import { useLayoutEffect, useRef } from 'react';
import '../../../styles/settings_menu.css';
import { scroll_reveal } from '../../../utils/consts/ScrollReveal';

interface SettingsMenuProps {
    toggleSettings: (e: React.MouseEvent) => void; 
}

const SettingsMenu = ({ toggleSettings } : SettingsMenuProps) => {
    // this will prob utilize a global state
    // so these settings can be saved throughout the game
    // but these are basic visuals for now
    const menuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if(menuRef.current) {
            scroll_reveal.reveal('.settings_menu', { origin: "top" });
        }
    }, []);

    return (
        <div ref={menuRef} className='settings_menu'>
            <h1 className='header1'>Game Settings</h1>

            {/* This will prob be a 2x2 grid container */}
            <div className='controls_container'>    
                {/* Sound */}


                {/* Keyboard Controls */}


                {/* Login */}
            </div>

            <button onClick={toggleSettings} className='exit_settings_button'>X</button>
        </div>
    );
}

export default SettingsMenu;