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

    console.log(selectedCharacter);

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
                            <div onClick={() => setSelectedCharacter(character)} key={index} className={`character_card ${selectedCharacter === character ? "active" : ""}`}>
                                <h1>{character}</h1>
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
