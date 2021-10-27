const Post = require('../models/post');
const Vote = require('../models/vote');

let fixtures = {
    // All non-expired and trending but at levels between 0 and 9.
    // 0 = least trending
    // 9 = most trending
    // Populated programmatically below.
    trending_by_level: {}
};

let x = 0;
while (x < 10) {
    const post = new Post();
    let voted_x_times = 0;
    while (voted_x_times < x + 1) {
        post.vote();
        voted_x_times++;
    }
    fixtures.trending_by_level[x] = post;
    x++;
}

module.exports = fixtures;