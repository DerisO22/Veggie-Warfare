import { useLayoutEffect, useRef, useState } from 'react';
import '../../../styles/settings_menu.css';
import { scroll_reveal } from '../../../utils/consts/ScrollReveal';
import { DEFAULT_SOUND_VALUES, useGameSound } from '../../../contexts/GameSoundsContext';

interface SettingsMenuProps {
    toggleSettings: (e: React.MouseEvent) => void; 
}

interface SoundSettingsType {
    sfx: number,
    music: number,
    other: number
}

const SettingsMenu = ({ toggleSettings } : SettingsMenuProps) => {
    // this will prob utilize a global state
    // so these settings can be saved throughout the game
    // but these are basic visuals for now
    const menuRef = useRef<HTMLDivElement>(null);
    const [ soundValues, setSoundValues ] = useState<SoundSettingsType>(DEFAULT_SOUND_VALUES);
    const { handleVolumeChange } = useGameSound();

    useLayoutEffect(() => {
        if(menuRef.current) {
            scroll_reveal.reveal('.settings_menu', { 
                scale: 0.95,
                distance: '0px',
                duration: 500
            });
        }
    }, []);

    const handleSoundValueChange = (e: React.ChangeEvent<HTMLInputElement>, soundType: string) => {
        const value = parseInt(e.target.value);
        setSoundValues(prev => ({ ...prev, [soundType]: value }));

        handleVolumeChange(soundType, value);
    }

    return (
        <div ref={menuRef} className='settings_menu'>
            <h1 className='header1'>Game Settings</h1>

            {/* This will prob be a 2x2 grid container */}
            <div className='controls_container'>
                {/*       */}
                {/* Sound */}
                {/*       */}
                <div className="sound_settings_container">
                    <div className='sound_input'>
                        <label htmlFor='range'>Music: {soundValues.music}</label>
                        <input type='range' 
                            min={0} 
                            max={100} 
                            step={1} 
                            value={soundValues.music}
                            onChange={(e) => handleSoundValueChange(e, "music")}
                        ></input>
                    </div>

                    <div className='sound_input'>
                        <label htmlFor='range'>SFX: {soundValues.sfx}</label>
                        <input type='range' 
                            min={0} 
                            max={100} 
                            step={1} 
                            value={soundValues.sfx}
                            onChange={(e) => handleSoundValueChange(e, "sfx")}
                        ></input>
                    </div>

                    <div className='sound_input'>
                        <label htmlFor='range'>Other: {soundValues.other}</label>
                        <input type='range'
                            min={0}
                            max={100}
                            step={1}
                            value={soundValues.other}
                            onChange={(e) => handleSoundValueChange(e, "other")}
                        ></input>
                    </div>
                </div>
                
                {/*                   */}
                {/* Keyboard Controls */}
                {/*                   */}
                <div className="keyboard_settings_container">

                </div>

                {/*       */}
                {/* Login */}
                {/*       */}
                <div className="auth_settings_container">

                </div>
            </div>

            <button onClick={toggleSettings} className='exit_settings_button'>X</button>
        </div>
    );
}

export default SettingsMenu;