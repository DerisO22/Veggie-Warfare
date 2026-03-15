import '../../../styles/settings_menu.css';

interface SettingsMenuProps {
    toggleSettings: (e: React.MouseEvent) => void; 
}

const SettingsMenu = ({ toggleSettings } : SettingsMenuProps) => {
    // this will prob utilize a global state
    // so these settings can be saved throughout the game
    // but these are basic visuals for now

    return (
        <div className='settings_menu'>
            <h1 className='header1'>Game Settings</h1>
        </div>
    );
}

export default SettingsMenu;