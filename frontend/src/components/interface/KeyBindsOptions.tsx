import { useState } from "react";
import { type KeybindChanges, useAbilities } from "../../contexts/AbilitiesContext";


const KeyBindsOptions = () => {
    const { playerKeybinds, updatePlayerKeybinds } = useAbilities();
    const [ updatedKeybind, setUpdatedKeybind ] = useState<string>();

    const handleKeybindChange = (setting: string) => {
        
    }

    return (
        <div className="keybind_settings_container">
            <h1>Keybinds</h1>
            {Object.entries(playerKeybinds).map(([setting, keybind]) => (
                <div key={setting} onClick={() => handleKeybindChange(setting)} className="keybind_setting">
                    <div className="setting_name">{setting}</div>
                    <div className="setting_keybind">{keybind}</div>
                </div>
            ))} 
        </div>
    )
}

export default KeyBindsOptions;