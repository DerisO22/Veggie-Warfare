import { useEffect, useRef } from 'react';
import type { KeyBindings } from '../types/controlType';
import { useSocket } from '../../contexts/useSocket';
import { useChatInput } from '../../contexts/ChatInput';
import { useCharacterSelect } from '../../contexts/CharacterSelectionContext';
import { ABILITY_MAP } from '../consts/abilites';

const DEFAULT_KEYS: KeyBindings = {
    forward: 'w',
    backward: 's',
    left: 'a',
    right: 'd',
    jump: ' ',
    ability1: 'shift',
    ability2: 'e'
};

export const useKeyboardControls = (keys: KeyBindings = DEFAULT_KEYS) => {
    const { socket } = useSocket();
    const pressedKeys = useRef<Set<string>>(new Set());
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
            if (Object.values(keys).includes(key)) {
                e.preventDefault();
            }

            // If key wasn't already pressed
            if (!pressedKeys.current.has(key)) {
                pressedKeys.current.add(key);

                /**
                 * All button presses to server
                 */
                if (key === keys.forward) socket.emit('setButton', { button: 'forward', value: true });
                if (key === keys.backward) socket.emit('setButton', { button: 'backward', value: true });
                if (key === keys.left) socket.emit('setButton', { button: 'left', value: true });
                if (key === keys.right) socket.emit('setButton', { button: 'right', value: true });
                if (key === keys.jump) socket.emit('setButton', { button: 'jump', value: true });

                if (key === keys.ability1) socket.emit('use_ability', { abilityKey: characterAbilities.ability1 });
                if (key === keys.ability2) socket.emit('use_ability', { abilityKey: characterAbilities.ability2 });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            pressedKeys.current.delete(key);

            // Send button release to server
            if (key === keys.forward) socket.emit('setButton', { button: 'forward', value: false });
            if (key === keys.backward) socket.emit('setButton', { button: 'backward', value: false });
            if (key === keys.left) socket.emit('setButton', { button: 'left', value: false });
            if (key === keys.right) socket.emit('setButton', { button: 'right', value: false });
            
            if (key === keys.jump) socket.emit('setButton', { button: 'jump', value: false });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [socket, keys, isPlayerInputting, selectedCharacter]);
};