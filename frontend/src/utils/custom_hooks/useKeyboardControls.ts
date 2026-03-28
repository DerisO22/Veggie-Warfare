import { useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/useSocket';
import { useChatInput } from '../../contexts/ChatInput';
import { useCharacterSelect } from '../../contexts/CharacterSelectionContext';
import { ABILITY_MAP } from '../consts/abilites';
import { useAbilities } from '../../contexts/AbilitiesContext';

export const useKeyboardControls = () => {
    const { socket } = useSocket();
    const pressedKeys = useRef<Set<string>>(new Set());
    const { playerKeybinds } = useAbilities();
    const { isPlayerInputting } = useChatInput();

    // For Specific Player Abilities
    const { selectedCharacter } = useCharacterSelect();

    useEffect(() => {
        if (!socket || !selectedCharacter) return;
        if(isPlayerInputting) return;

        const characterAbilities = ABILITY_MAP[selectedCharacter];

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            
            // Prevent default for game keys
            if (Object.values(playerKeybinds).includes(key)) {
                e.preventDefault();
            }

            // If key wasn't already pressed
            if (!pressedKeys.current.has(key)) {
                pressedKeys.current.add(key);

                /**
                 * All button presses to server
                 */
                if (key === playerKeybinds.forward) socket.emit('setButton', { button: 'forward', value: true });
                if (key === playerKeybinds.backward) socket.emit('setButton', { button: 'backward', value: true });
                if (key === playerKeybinds.left) socket.emit('setButton', { button: 'left', value: true });
                if (key === playerKeybinds.right) socket.emit('setButton', { button: 'right', value: true });
                if (key === playerKeybinds.jump) socket.emit('setButton', { button: 'jump', value: true });

                if (key === playerKeybinds.ability1) socket.emit('use_ability', { abilityKey: characterAbilities.ability1 });
                if (key === playerKeybinds.ability2) socket.emit('use_ability', { abilityKey: characterAbilities.ability2 });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            pressedKeys.current.delete(key);

            // Send button release to server
            if (key === playerKeybinds.forward) socket.emit('setButton', { button: 'forward', value: false });
            if (key === playerKeybinds.backward) socket.emit('setButton', { button: 'backward', value: false });
            if (key === playerKeybinds.left) socket.emit('setButton', { button: 'left', value: false });
            if (key === playerKeybinds.right) socket.emit('setButton', { button: 'right', value: false });
            
            if (key === playerKeybinds.jump) socket.emit('setButton', { button: 'jump', value: false });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [socket, isPlayerInputting, selectedCharacter, playerKeybinds]);
};