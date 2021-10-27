class PopularityCalculator {
    constructor(posts) {
        this.posts = [...posts];
    }

    trending_by_quantity(q = 5) {
        const grab_top_5_trending = () => {
            let posts = [...this.posts].sort((a, b) => {
                return b.static_trending - a.static_trending;
            }).slice(0, q);

            let posts_needing_updates = posts
                .filter(p => p.needs_update)
                .map(p => this.get_post_by_id(p.id));

            if (!posts_needing_updates.length) return posts;

            posts_needing_updates.forEach(p => p.update_static_trending());
            return grab_top_5_trending();
        }
        return grab_top_5_trending();
    }

    get_post_by_id(id) {
        // Return the actual post object by reference
        return this.posts.filter(p => p.id === id)[0];
    }
}

module.exports = PopularityCalculator;