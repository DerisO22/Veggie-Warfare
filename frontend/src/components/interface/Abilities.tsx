import { useEffect, useState } from 'react';
import { useCharacterSelect } from '../../contexts/CharacterSelectionContext';
import { useVoting } from '../../contexts/VotingContext';
import '../../styles/abilities.css';
import { ABILITY_MAP, type CharacterAbilities } from '../../utils/consts/abilites';
import { useAbilities } from '../../contexts/AbilitiesContext';

const Abilities = () => {
    const { hasVotingStarted, hasVotingEnded } = useVoting();
    const { selectedCharacter } = useCharacterSelect();
    const { abilityButtonRefs, playerKeybinds } = useAbilities();
    const [ characterAbilties, setCharacterAbilities ] = useState<CharacterAbilities>();

    useEffect(() => {
        if(!selectedCharacter) return;

        setCharacterAbilities(ABILITY_MAP[selectedCharacter])
    }, [selectedCharacter]);

    return (
        <>
            {!hasVotingStarted && hasVotingEnded && characterAbilties && (
                <div className="abiltiies_container">
                    {Object.values(characterAbilties).map((ability, index) => (
                        <div ref={(el) => (abilityButtonRefs.current[ability] = el)} key={index} className={`abilities_card card${index}`}>
                            <span>{playerKeybinds?.[`ability${(index + 1)}`]}</span>
                            <span>{ability}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default Abilities;