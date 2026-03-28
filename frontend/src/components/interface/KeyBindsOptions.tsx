import { useEffect, useState } from "react";
import { useAbilities, type KeybindChanges } from "../../contexts/AbilitiesContext";
import { DEFAULT_KEYBINDS } from "../../utils/consts/Keybinds";

const KeyBindsOptions = () => {
    const { playerKeybinds, updatePlayerKeybinds } = useAbilities();
    const [ updatedKeybind, setUpdatedKeybind ] = useState<string | null>(null);
    const [ isUpdateKeybindVisible, setIsUpdateKeybindVisible ] = useState<boolean>(false);

    const handleKeybindChange = (setting: string) => {
        setIsUpdateKeybindVisible(true);
        setUpdatedKeybind(setting);
    }

    const resetKeyBinds = () => {
        updatePlayerKeybinds(DEFAULT_KEYBINDS);
    }

    useEffect(() => {
        if(!isUpdateKeybindVisible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            if(updatedKeybind) {
                const changes: KeybindChanges = {
                    [updatedKeybind]: e.key
                }

                updatePlayerKeybinds(changes);
                setIsUpdateKeybindVisible(false);
                setUpdatedKeybind(null);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isUpdateKeybindVisible, updatedKeybind, updatePlayerKeybinds]);

    return (
        <div className="keybind_settings_container">
            <h1>Keybinds</h1>
            {Object.entries(playerKeybinds).map(([setting, keybind]) => (
                <div key={setting} onClick={() => handleKeybindChange(setting)} className="keybind_setting">
                    <div className="setting_name">{setting}</div>
                    <div className="setting_keybind">{keybind}</div>
                </div>
            ))} 

            <div onClick={() => resetKeyBinds()} className="keybind_setting reset_button">
                Reset Keybinds
            </div>

            {isUpdateKeybindVisible && (
                <div className="update_keybind_alert">
                    Click on a Key to Change Keybind <strong>"{updatedKeybind}"</strong>
                </div>
            )}
        </div>
    )
}

export default KeyBindsOptions;