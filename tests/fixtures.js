let fixtures = {
    // All non-expired and trending but at levels between 0 and 9.
    // 0 = least trending
    // 9 = most trending
    // Populated programmatically below.
    trending_by_level: {}
};

let x = 0;
while (x < 10) {
    fixtures.trending_by_level[x] = () => {
        let post = new Post();
        post.votes = new Array(x + 1).fill(new Vote());
        return post;
    };
    x++;
}

module.exports = fixtures;