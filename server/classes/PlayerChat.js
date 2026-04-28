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
import { InputValidator } from "../utils/InputValidator.js";

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
        console.log("Hello?")
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

        // Validate whisper
        const validation = InputValidator.validateWhisperCommand(targetString, message, this.player.game);
        if (!validation.valid) {
            this.player.socket.emit("error", validation.error);
            return;
        }

        // Sanitize message
        const sanitizedMessage = InputValidator.sanitizeMessage(validation.message);

        validation.targetPlayers.forEach((target) => {
            target.socket.emit("whisper_command", {
                from: this.player.nickname,
                text: sanitizedMessage
            });
        });
    }

    handle_nickname_command(args) {
        const newNickname = args.join(" ");
        
        // Validate nickname
        const validation = InputValidator.validateNickname(newNickname);
        if (!validation.valid) {
            this.player.socket.emit("error", validation.error);
            return;
        }
    
        this.player.setNickname(validation.nickname);
        this.player.socket.emit("nickname_changed", { nickname: validation.nickname });
    }

    handle_color_command(color) {
        const newColor = color[0];
        this.player.socket.emit("color_command", newColor);
    }   

    handle_leave_command() {
        this.player.socket.disconnect();
    }

    broadcast_message(text) {
        const sanitizedText = InputValidator.sanitizeMessage(text);

        const broadcast_message = {
            from: this.player.nickname,
            text: sanitizedText,
            time: Date.now(),
        };

        this.player.game.io.sockets.emit("broadcast_message", broadcast_message);
    }
}