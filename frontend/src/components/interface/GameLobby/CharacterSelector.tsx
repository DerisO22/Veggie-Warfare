import { useLayoutEffect, useState } from "react";
import { useCharacterSelect } from "../../../contexts/CharacterSelectionContext";
import '../../../styles/character_selector.css';
import { scroll_reveal } from "../../../utils/consts/ScrollReveal";

const CharacterSelector = () => {
    const { characterData, selectedCharacter, setSelectedCharacter, handleCharacterSelection } = useCharacterSelect();
    const [ isSelectorVisible, setIsSelectorVisible ] = useState<boolean>(false);

    useLayoutEffect(() => {
        scroll_reveal.reveal('.selector_container', {
            duration: 300,
            distance: '0px',
            scale: 0.98
        });
    }, [isSelectorVisible]);

    return (
        <>
            <div className="character_info_panel">
                <div className={`character_icon ${selectedCharacter}_model_active`} />
                <div className="character_underline"/>
                <div className="info_text">Current Class: {selectedCharacter}</div>
                <button className="choose_player_button" onClick={() => setIsSelectorVisible(prev => !prev)}>
                    <div className="carrot_icon"></div>
                    <span>Choose Player</span>
                </button>
            </div>

            {isSelectorVisible && characterData && (
                <div className="selector_container">
                    <h1 className="header1">Veggie Selector</h1>

                    <div className="cards_container">
                        {characterData.characters.map((character, index) => (
                            <div onClick={() => {handleCharacterSelection(character)}} key={index} className={`character_card ${selectedCharacter === character ? "active" : ""}`}>
                                <h1>{character.toUpperCase()}</h1>

                                <div className="character_info">
                                    {Object.entries(characterData.characterInfo[character])
                                    .filter(([key]) => !['name', 'color'].includes(key))
                                    .map(([key, val])=> (
                                        <>
                                            {Array.isArray(val) ? (
                                                <>
                                                    <span key={key} className="abilties_header">Abilities</span>
                                                    {val.map((ability, i) => (
                                                        <span key={i} className="ability_item">{ability}</span>
                                                    ))}
                                                </>
                                            ) : (
                                                <p className="info_val">{val}</p>
                                            )}
                                        </>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="exit_selector_button" onClick={() => setIsSelectorVisible(prev => !prev)}>X</button>
                </div>
            )}
        </>
    )
}

export default CharacterSelector;