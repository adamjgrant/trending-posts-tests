// Classes
const Post = require("../models/post");
const Vote = require("../models/vote");
const PopularityCalculator = require("../models/popularity_calculator");

// Functions
const vote = require("../functions/vote");
const expire_votes = require("../functions/expire_votes");
const { TestWatcher } = require("@jest/core");

let fixtures = require("./fixtures");

test('Top five out of ten trending posts correctly identified', () => {
    let posts = [];
    let x = 0;
    // Make these in the wrong order to start.
    // Least to most popular.
    while (x < 10) {
        posts.push(fixtures.trending_by_level[x]);
        x++;
    }

    const popularity_calculator = new PopularityCalculator(posts);
    const trending_ids = popularity_calculator.trending_by_quantity().map(p => [p.id, p.static_trending]);
    const expected_trending_post_ids = [
        posts[9], posts[8], posts[7], posts[6], posts[5]
    ].map(p => [p.id, p.static_trending]);

    expect(trending_ids).toEqual(expected_trending_post_ids);
});

test('Top five recently trending posts does not include very old popular post', () => {
    let posts = [];
    let x = 0;
    // Make these in the wrong order to start.
    // Least to most popular.
    while (x < 10) {
        posts.push(fixtures.trending_by_level[x]);
        x++;
    }

    // Take the highest static trending post and make it very old.
    // This should bump down its dynamic trending value abysmally.
    let a_long_time_ago = new Date(0);
    posts[9].last_voted_on = a_long_time_ago;
    posts[9].votes = posts[9].votes.map(v => new Vote(a_long_time_ago));

    const popularity_calculator = new PopularityCalculator(posts);
    const trending_ids = popularity_calculator.trending_by_quantity().map(p => [p.id, p.static_trending]);
    const expected_trending_post_ids = [
        posts[8], posts[7], posts[6], posts[5], posts[4]
    ].map(p => [p.id, p.static_trending]);

    expect(trending_ids).toEqual(expected_trending_post_ids);
});