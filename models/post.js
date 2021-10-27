const Vote = require('./vote');

class Post {
    constructor() {
        this.votes = [];
        this.last_updated = Date.now();
        this.last_voted_on = undefined;
        this.id = Math.floor(Math.random() * (10 ** 20));
        this.static_trending = 0;
    }

    vote() {
        this.touch();
        this.votes.push(new Vote());
        this.last_voted_on = this.votes[this.votes.length - 1].time;
        this.update_static_trending();
    }

    touch() {
        this.last_updated = Date.now();
    }

    update_static_trending() {
        this.touch();
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