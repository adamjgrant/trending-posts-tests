// Classes
const Post = require("../models/post");

// Functions
const vote = require("../functions/vote");
const expire_votes = require("../functions/expire_votes");
const calculate_popularity = require("../functions/calculate_popularity");

const fixtures = {
    expired_post: undefined;
};