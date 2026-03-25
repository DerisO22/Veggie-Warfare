export class Lobby {
    constructor(io) {
        this.io = io;
        // going to be 30 seconds for voting
        this.voting_duration = 10000;

        this.votes = {
            map1: 0,
            map2: 0,
            map3: 0
        }

        this.player_votes = {};
        this.voting_active = false;
        this.vote_handlers_registered = false;
        this.voting_start_time = null;
    }

    getVotingState() {
        const timestamp = new Date(Date.now());
        const votingState = {
            duration: this.voting_duration,
            server_time: timestamp,
            current_votes: this.votes
        };

        return votingState;
    }

    tallyVotes() {
        return Object.keys(this.votes).reduce((a, b) => this.votes[a] > this.votes[b] ? a : b);
    }

    startVoting() {
        if (this.voting_active) {
            console.warn("Voting already in progress");
            return Promise.reject("Voting already active");
        }
 
        this.voting_active = true;
        this.voting_start_time = Date.now();
        this.votes = { map1: 0, map2: 0, map3: 0 };
        this.player_votes = {};

        // make sure vote register once
        if(!this.vote_handlers_registered) {
            this.vote_handlers_registered = true;
        }
        
        const votingState = this.getVotingState();
        this.io.sockets.emit("start_vote", votingState);

        return new Promise((resolve) => {
            this.voteTimeout = setTimeout(() => {
                const winner = this.tallyVotes();
                const finalVotes = { ...this.votes };

                this.voting_active = false;

                this.io.sockets.emit("end_vote", {
                    winner,
                    finalVotes
                });

                resolve(winner);
            }, this.voting_duration);
        });
    };

    setUpVotingSockets(socket) {
        // choice will just be map1, map2, map3
        socket.on("player_vote", ({ choice }) => {
            console.log(this.voting_active)
            if (!this.voting_active) {
                console.warn(`Player ${socket.id} voted after voting ended`);
                return;
            }

            if (!["map1", "map2", "map3"].includes(choice)) {
                console.warn(`Player ${socket.id} voted for invalid map: ${choice}`);
                return;
            }

            const playerId = socket.id;

            if(this.player_votes[playerId]) return;

            this.player_votes[playerId] = choice;
            this.votes[choice]++;

            this.io.sockets.emit("vote_update", {
                current_votes: this.votes
            });
        });
    
        socket.on("disconnect", () => {
            const vote = this.player_votes[socket.id];

            if(vote && this.voting_active) {
                this.votes[vote]--;
                delete this.player_votes[socket.id];
            }

            this.io.sockets.emit("vote_update", {
                current_votes: this.votes
            });
        });
    }

    cancelVoting() {
        if (this.voteTimeout) {
            clearTimeout(this.voteTimeout);
        }
        this.voting_active = false;
        this.votes = { map1: 0, map2: 0, map3: 0 };
        this.player_votes = {};
    }
}