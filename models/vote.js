class Vote {
    // For testing, allow me to set this manually.
    constructor(time = new Date()) {
        this.time = time;
    }

    get days_old() {
        return Math.floor((new Date() - this.time) / 86400000);
    }

    get weighted_value() {
        return 1 / (this.days_old + 1);
    }

    get older_than_24_hours() {
        return this.days_old >= 1;
    }
}

module.exports = Vote;