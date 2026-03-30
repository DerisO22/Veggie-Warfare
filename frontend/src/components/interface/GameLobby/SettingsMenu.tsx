import { useLayoutEffect, useRef, useState } from 'react';
import '../../../styles/settings_menu.css';
import { scroll_reveal } from '../../../utils/consts/ScrollReveal';
import { DEFAULT_SOUND_VALUES, useGameSound } from '../../../contexts/GameSoundsContext';
import KeyBindsOptions from '../KeyBindsOptions';
import { SignOutButton, UserProfile } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import { usePlayerData } from '../../../contexts/PlayerContext';

interface SettingsMenuProps {
    toggleSettings: (e: React.MouseEvent) => void; 
}

interface SoundSettingsType {
    sfx: number,
    music: number,
    other: number
}

const SettingsMenu = ({ toggleSettings } : SettingsMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const { handleVolumeChange } = useGameSound();

    // For saving player sound/keybind settings
    const [ soundValues, setSoundValues ] = useState<SoundSettingsType>(DEFAULT_SOUND_VALUES);
    const { save_player_data, updateSoundSettings } = usePlayerData();

    const handleSaveSettings = () => {
        save_player_data()
    }

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
        const newSoundValues = { ...soundValues, [soundType]: value}
        setSoundValues(prev => ({ ...prev, [soundType]: value }));

        handleVolumeChange(soundType, value);
        updateSoundSettings(newSoundValues);
    }

    return (
        <div ref={menuRef} className='settings_menu'>
            <div className="settings_menu_header">
                <h1 className='header1'>Game Settings</h1>
                <button onClick={toggleSettings} className='exit_settings_button'>X</button>
            </div>

            <button onClick={handleSaveSettings} className='save_button'>Save Settings</button>

            {/* This will prob be a 2x2 grid container */}
            <div className='controls_container'>
                {/*       */}
                {/* Sound */}
                {/*       */}
                <div className="sound_settings_container">
                    <h1>Sounds</h1>
                    
                    <div className="sound_inputs_container">
                        <div className='sound_input'>
                            <label htmlFor='range'>Music: {soundValues.music}</label>
                            <input className='sound_slider' type='range' 
                                min={0} 
                                max={100} 
                                step={1} 
                                value={soundValues.music}
                                onChange={(e) => handleSoundValueChange(e, "music")}
                            ></input>
                        </div>

                        <div className='sound_input'>
                            <label htmlFor='range'>SFX: {soundValues.sfx}</label>
                            <input className='sound_slider' type='range' 
                                min={0} 
                                max={100} 
                                step={1} 
                                value={soundValues.sfx}
                                onChange={(e) => handleSoundValueChange(e, "sfx")}
                            ></input>
                        </div>

                        <div className='sound_input'>
                            <label htmlFor='range'>Other: {soundValues.other}</label>
                            <input className='sound_slider' type='range'
                                min={0}
                                max={100}
                                step={1}
                                value={soundValues.other}
                                onChange={(e) => handleSoundValueChange(e, "other")}
                            ></input>
                        </div>
                    </div>
                </div>
                
                {/*                   */}
                {/* Keyboard Controls */}
                {/*                   */}
                <KeyBindsOptions />
            </div>

            {/*       */}
            {/* Login */}
            {/*       */}
            <div className="auth_settings_container">
                <UserProfile 
                    appearance={{
                        theme: dark
                    }}
                />

                <SignOutButton>
                    <button className='clerk_signout_button'>Sign Out</button>
                </SignOutButton>
            </div>
        </div>
    );
}

export default SettingsMenu;