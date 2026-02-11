import { useEffect, useRef } from 'react';
import type { KeyBindings } from '../types/controlType';
import { useSocket } from '../../contexts/useSocket';

const DEFAULT_KEYS: KeyBindings = {
    forward: 'w',
    backward: 's',
    left: 'a',
    right: 'd',
};

export const useKeyboardControls = (keys: KeyBindings = DEFAULT_KEYS) => {
    const socket = useSocket();
    const pressedKeys = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!socket) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            
            // Prevent default for game keys
            if (Object.values(keys).includes(key)) {
                e.preventDefault();
            }

            // If key wasn't already pressed
            if (!pressedKeys.current.has(key)) {
                pressedKeys.current.add(key);

                // Send button press to server
                if (key === keys.forward) socket.emit('setButton', { button: 'forward', value: true });
                if (key === keys.backward) socket.emit('setButton', { button: 'backward', value: true });
                if (key === keys.left) socket.emit('setButton', { button: 'left', value: true });
                if (key === keys.right) socket.emit('setButton', { button: 'right', value: true });
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
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [socket, keys]);
};