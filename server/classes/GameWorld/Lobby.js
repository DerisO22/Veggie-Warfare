export class Lobby {
    constructor(io) {
        this.io = io;
        // going to be 30 seconds for voting
        this.voting_duration = 30000;

        this.votes = {
            map1: 0,
            map2: 0,
            map3: 0
        }

        this.player_votes = {}
    }

    getVotingState() {
        const timestamp = new Date(Date.now());
        const votingState = {
            duration: this.voting_duration,
            server_time: timestamp,
        };

        return votingState;
    }

    tallyVotes() {
        return Object.keys(this.votes).reduce((a, b) => this.votes[a] > this.votes[b] ? a : b);
    }

    startVoting() {
        this.setUpVotingSockets();
        
        const votingState = this.getVotingState();
        this.io.sockets.emit("start_vote", votingState);

        return new Promise((resolve) => {
            this.voteTimeout = setTimeout(() => {
                const winner = this.tallyVotes();
                this.io.sockets.emit("end_vote", winner);
                resolve(winner);
            }, this.voting_duration);
        });
    };

    setUpVotingSockets() {
        this.io.on("connection", (socket) => {
            // choice will just be map1, map2, map3
            socket.on("player_vote", ({ choice }) => {
                const playerId = socket.id;

                if(this.player_votes[playerId]) return;

                this.player_votes[playerId] = choice;
                this.votes[choice]++;
            });
        
            socket.on("disconnect", () => {
                const vote = this.player_votes[socket.id];

                if(vote) {
                    this.votes[vote]--;
                    delete this.player_votes[socket.id];
                }
            });
        });
    }
}