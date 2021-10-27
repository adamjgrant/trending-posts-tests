class PopularityCalculator {
    constructor(posts) {
        this.posts = [...posts];
    }

    trending_by_quantity(q = 5) {
        return this.posts.sort((a, b) => {
            return b.static_trending - a.static_trending;
        }).slice(0, q);
    }
}

module.exports = PopularityCalculator;