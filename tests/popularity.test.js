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
        posts.push(new Post(fixtures.trending_by_level[x]));
        x++;
    }

    const popularity_calculator = new PopularityCalculator(posts);
    const trending_ids = popularity_calculator.trending_by_quantity(5).map(p => p.id);
    const expected_trending_post_ids = posts.reverse().map(post => post.id).splice(0, 5);

    expect(trending_ids).toEqual(expected_trending_post_ids);
});