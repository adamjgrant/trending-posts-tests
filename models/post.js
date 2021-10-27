const Vote = require('./vote');

class Post {
    constructor() {
        this.votes = [];
        this.last_voted_on = undefined;
        this.id = Math.floor(Math.random() * 999999999999);
    }

    vote() {
        this.votes.push(new Vote());
        this.last_voted_on = vote.time;
        expire_votes();
    }

    expire_votes() {
        this.votes = this.votes.filter(vote => !vote.older_than_24_hours);
    }
}

module.exports = Post;