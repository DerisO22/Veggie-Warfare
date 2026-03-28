import { useEffect, useState } from "react";
import { useAbilities, type KeybindChanges } from "../../contexts/AbilitiesContext";

const KeyBindsOptions = () => {
    const { playerKeybinds, updatePlayerKeybinds } = useAbilities();
    const [ updatedKeybind, setUpdatedKeybind ] = useState<string | null>(null);
    const [ isUpdateKeybindVisible, setIsUpdateKeybindVisible ] = useState<boolean>(false);

    const handleKeybindChange = (setting: string) => {
        setIsUpdateKeybindVisible(true);
        setUpdatedKeybind(setting);
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

            {isUpdateKeybindVisible && (
                <div className="update_keybind_alert">
                    Click on a Key to Change Keybind {updatedKeybind}
                </div>
            )}
        </div>
    )
}

export default KeyBindsOptions;