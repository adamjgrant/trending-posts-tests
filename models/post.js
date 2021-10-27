const Vote = require('./vote');

class Post {
    constructor() {
        this.votes = [];
        this.last_voted_on = undefined;
        this.id = Math.floor(Math.random() * (10 ** 20));
        this.static_trending = 0;
    }

    vote() {
        this.votes.push(new Vote());
        this.last_voted_on = this.votes[this.votes.length - 1].time;
        this.update_static_trending();
    }

    update_static_trending() {
        this.expire_votes();
        this.static_trending = this.votes.length;
    }

    expire_votes() {
        this.votes = this.votes.filter(vote => !vote.older_than_24_hours);
    }
}

module.exports = Post;