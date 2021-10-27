const Vote = require('./vote');

class Post {
    constructor() {
        this.votes = [];
        this.compressed_vote_count = 0;
        this.last_updated = Date.now();
        this.last_voted_on = undefined;
        this.id = Math.floor(Math.random() * (10 ** 20));
        this.static_trending = 0;
        this.maximum_raw_votes = 100;
    }

    vote() {
        this.touch();
        this.votes.push(new Vote());
        this.last_voted_on = this.votes[this.votes.length - 1].time;
        this.compressed_vote_count += 1;
        this.update_static_trending();
    }

    reduce_votes_to_maximum() {
        if (this.votes.length > this.maximum_raw_votes) {
            this.votes.shift();
        }
    }

    touch() {
        this.last_updated = Date.now();
    }

    update_static_trending() {
        this.touch();
        this.reduce_votes_to_maximum();
        this.static_trending = this.votes.reduce((p, n) => p + n.weighted_value, 0);
    }

    get older_than_24_hours() {
        if (!this.last_updated) return true;
        return this.last_updated < Date.now() - 86400000;
    }

    get needs_update() {
        return this.votes.length && this.older_than_24_hours;
    }
}

module.exports = Post;