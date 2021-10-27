const Post = require("../models/post");
const Vote = require("../models/vote");
const PopularityCalculator = require("../models/popularity_calculator");
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
    posts[9].last_updated = a_long_time_ago;
    posts[9].votes = posts[9].votes.map(v => new Vote(a_long_time_ago));

    const popularity_calculator = new PopularityCalculator(posts);
    const trending_ids = popularity_calculator.trending_by_quantity().map(p => [p.id, p.static_trending]);
    const expected_trending_post_ids = [
        posts[8], posts[7], posts[6], posts[5], posts[4]
    ].map(p => [p.id, p.static_trending]);

    expect(trending_ids).toEqual(expected_trending_post_ids);
});

test('Top five recently trending posts includes old posts if there are only old posts.', () => {
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
    posts.forEach(post => {
        post.last_voted_on = a_long_time_ago;
        post.last_updated = a_long_time_ago;
        post.votes = post.votes.map(v => new Vote(a_long_time_ago));
        post.update_static_trending();
    });

    const popularity_calculator = new PopularityCalculator(posts);
    const trending_ids = popularity_calculator.trending_by_quantity().map(p => [p.id, p.static_trending]);
    const expected_trending_post_ids = [
        posts[9], posts[8], posts[7], posts[6], posts[5]
    ].map(p => [p.id, p.static_trending]);

    expect(trending_ids).toEqual(expected_trending_post_ids);
});

test("Everything else being equal, posts a day apart degrade in trending status", () => {
    // Make 10 identical posts with three same-day votes each.
    let posts = [];
    let x = 0;
    while (x < 10) {
        posts.push(fixtures.trending_by_level[3]);
        x++;
    }

    const age_date_by_days = (date, days = 0) => {
        const one_day_in_ms = 24 * 60 * 60 * 1000;
        return date - (one_day_in_ms * days);
    }

    // Make each 1 day older than the previous one, including their votes.
    // Makes the array oldest to newest.
    posts.forEach((post, index) => {
        const new_date = age_date_by_days(post.last_voted_on, 10 - index);
        post.last_voted_on = new_date;
        post.last_updated = new_date;
        post.votes = post.votes.map(v => new Vote(new_date));
        post.update_static_trending();
    });

    const expected_trending_post_ids = [
        posts[9], posts[8], posts[7], posts[6], posts[5]
    ].map(p => [p.id, p.static_trending]);

    const popularity_calculator = new PopularityCalculator(posts);
    const trending_ids = popularity_calculator.trending_by_quantity().map(p => [p.id, p.static_trending]);

    expect(trending_ids).toEqual(expected_trending_post_ids);
});

test("Posts have a maximum number of votes to be considered (100) and the oldest are retired first", () => {
    // Make a post with 100 votes.
    const max = 100;
    const post = new Post();
    let x = 0;
    while (x < max) {
        post.vote();
        x++;
    }

    // Make the first vote the oldest one.
    let second_oldest_vote_time = post.votes[0].time;
    let a_long_time_ago = new Date(0);
    post.votes[0] = new Vote(a_long_time_ago);
    post.update_static_trending();

    // Now vote one more than the maximum we will hold as raw votes.
    post.vote();

    // Regardless of our efficiency in shoving off old records, the compressed voting
    // score is just a simple number persisted to the record. That should keep incrementing.
    expect(post.compressed_vote_count).toEqual(max + 1);
    expect(post.votes.length).toEqual(max);
    expect(post.votes[0].time).toEqual(second_oldest_vote_time);
});