class Vote {
    // For testing, allow me to set this manually.
    constructor(time = new Date()) {
        this.time = time;
    }

    get older_than_24_hours() {
        return (new Date() - this.time) > 86400000;
    }
}

module.exports = Vote;