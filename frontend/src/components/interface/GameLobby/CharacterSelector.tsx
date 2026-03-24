import { useEffect, useState } from "react";
import { useCharacterSelect } from "../../../contexts/CharacterSelectionContext";
import '../../../styles/character_selector.css';

const CharacterSelector = () => {
    const { characterData, selectedCharacter, handleCharacterSelection } = useCharacterSelect();
    const [ isSelectorVisible, setIsSelectorVisible ] = useState<boolean>(true);

    useEffect(() => {
        if(!characterData) return;

        characterData.characters.map((val) => {
            console.log(val);
        })
    })

    return (
        <>
            <div className="character_info_panel">
                <div className="character_icon" />
                <div className="character_underline"/>
                <button className="choose_player_button" onClick={() => setIsSelectorVisible(prev => !prev)}>
                    <div className="carrot_icon"></div>
                    <span>Choose Player</span>
                </button>
            </div>

            {isSelectorVisible && characterData && (
                <div className="selector_container">
                    {characterData.characters.map((character) => (
                        <div className="character_card_container">
                            <h1>{character}</h1>
                        </div>
                    ))}
                </div>
            )}
        </>
        
    )
}

export default CharacterSelector
