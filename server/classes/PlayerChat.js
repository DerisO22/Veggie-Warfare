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

export class PlayerChat {
    constructor (player, io) {
        this.player = player;
        this.io = io;

        this.player_chats = {};
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
        const [ command, ...args ] = text.splice(1).split(" ");

        switch(command.toLowerCase()) {
            case 'help':
                handle_help_command();
                break;
            case 'whisper':
                handle_whisper_command(args);
                break;
            case 'nickname':
                handle_nickname_command(args);
                break;
            case 'color':
                handle_color_command(args);
                break;
            case 'leave':
                handle_leave_command();
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

    }

    handle_whisper_command(args) {
        const send_to_players = args.split(" ");

    }

    handle_nickname_command(newNickname) {

    }

    handle_color_command(newColor) {

    }

    handle_leave_command() {

    }

    broadcast_message(text) {
        // Need to add broadcasting socket on
    }
}