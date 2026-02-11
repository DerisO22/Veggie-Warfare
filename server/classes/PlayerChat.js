/**
 *  Commands we currently have:
 *  
 *  "/help"     - displays all the available commands
 *  "/whisper"  - sends a message to either one or multiple specific players
 *  "/nickname" - changes the players display username
 *  "/color"    - changes the color of their chat messages
 *  "/leave"    - disconnects the player
 * 
 */
import { HelpCommandMessage } from "../utils/consts.js";

export class PlayerChat {
    constructor (player, socket) {
        this.player = player;
        this.socket = socket;
        this.io = socket.id;

        this.player_chats = [];
    }

    setPlayerChats(username, text, time) {
        this.player_chats.push({ username, text, time });
    }

    getPlayerChats() {
        return {
            chats: this.player_chats
        }
    }

    handleMessage(text) {
        // It's either a reg message or one wit command "/"
        if(text.startsWith("/")) {
            this.parseCommandMessage(text);
        } else {
            this.broadcast_message(text);
        }
    }

    parseCommandMessage(text) {
        const [ command, ...args ] = text.slice(1).split(" ");

        switch(command.toLowerCase()) {
            case 'help':
                this.handle_help_command();
                break;
            case 'whisper':
                this.handle_whisper_command(args);
                break;
            case 'nickname':
                this.handle_nickname_command(args);
                break;
            case 'color':
                this.handle_color_command(args);
                break;
            case 'leave':
                this.handle_leave_command();
                break;
            default:
                // maybe an error, but would only really
                // happen if they forgot to add a space
                // after the command
                break;
        }
    }

    /**
     *  Command Handler Functions
     */
    handle_help_command() {
        const helper_message = {
            text: HelpCommandMessage,
            time: Date.now(),
        }

        this.player.socket.emit("help_command", helper_message);
    }

    /**
     * /whisper command is going to list the target player using commas
     * like "/whisper name1,name2,name3 This is the message"
     */
    handle_whisper_command(args) {
        const [ targetString, ...messageString ] = args;
        const message = messageString.join(" ");

        const targets = targetString.split(',').map((username) => username.trim());

        const targetPlayers = targets.map((targetName) => {
            return Object.values(this.player.game.players)
            .find(p => p.nickname === targetName)
        }).filter(p => p);

        if(targetPlayers) {
            targetPlayers.map((target) => {
                target.socket.emit("whisper_command", {
                    from: this.player.nickname,
                    text: message
                });
            })
        }
    }

    handle_nickname_command(newNickname) {
        this.player.setNickname(newNickname.join(" "));
    }

    handle_color_command(newColor) {
        this.player.game.io.sockets.emit("color_command", newColor );
    }   

    handle_leave_command() {
        this.player.socket.disconnect();
    }

    broadcast_message(text) {
        const broadcast_message = {
            from: this.player.nickname,
            text: text,
            time: Date.now(),
        };

        this.player.game.io.sockets.emit("broadcast_message", broadcast_message);
    }
}