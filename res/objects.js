class Events {
    constructor() {
        this.events = [];
    }

    add(event) {
        this.events.push(event);
    }

    get(id) {
        if (!id) return this.events;
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].id === id) return this.events[i];
        }
        return null;
    }

    getTags(tag) {
        let result = [];
        this.events.forEach(function(e) {if (e.tags.indexOf(tag.toLowerCase()) !== -1) result.push(e);});
        return result;
    }

    remove(event) {
        this.events.splice(this.events.indexOf(event), 1);
    }

    filterDay(d, m, y) {
        let result = [];
        d = parseInt(d);
        m = parseInt(m);
        y = parseInt(y);
        this.events.forEach(function(e) {
            if (e.start_time.day === d && e.start_time.month === m && e.start_time.year === y) result.push(e);
        });
        return this.sorted(this.filters(result), "time");
    }

    filters(subset) {
        let result = [];
        let result1 = [];
        let result2 = [];
        let result3 = [];
        if (active_filters.classes.length) {
            subset.forEach(function(e) {
                let passed = false;
                active_filters.classes.forEach(function(f) {if (e.tags1.indexOf(f) !== -1) passed = true;});
                if (passed) result1.push(e);
            });
        } else subset.forEach(function(e) {result1.push(e);});

        if (active_filters.areas.length) {
            subset.forEach(function(e) {
                let passed = false;
                active_filters.areas.forEach(function(f) {if (e.tags3.indexOf(f) !== -1) passed = true;});
                if (passed) result2.push(e);
            });
        } else subset.forEach(function(e) {result2.push(e);});

        if (active_filters.search.length) {
            subset.forEach(function(e) {
                if (parseTextToSearch(e.title).indexOf(parseTextToSearch(active_filters.search)) !== -1) result3.push(e);
            });
        } else subset.forEach(function(e) {result3.push(e);});
        subset.forEach(function(e) {
            if (result1.indexOf(e) !== -1 && result2.indexOf(e) !== -1 && result3.indexOf(e) !== -1) result.push(e);
        });
        return result;
    }

    sorted(subset, key) {
        if (key === "time") {
            return _.sortBy(subset, 'sortingvalue');
        }
        return subset;
    }
}

class Event {
    constructor(data) {
        this.title = data.title;
        this.id = data.id;
        this.content = data.content;
        this.content = this.content.replace(/\\r\\n/g, "<br>");
        this.content = this.content.replace(/\\n/g, "<br>");
        this.tags1 = data.tags1;
        this.tags2 = data.tags2;
        this.tags3 = data.tags3;
        this.tags4 = data.tags4;

        if (typeof data.special === "string") {
            if (data.special === "0") this.special = false;
            else this.special = true;
        } else this.special = data.special;

        if (typeof data.public === "string") {
            if (data.public === "0") this.public = false;
            else this.public = true;
        } else this.public = data.public;
        this.sortingvalue = data.start_time.sortingvalue;
        this.start_time = data.start_time;
    }

    exportToPost(exporting_new) {
        let result = {
            title: this.title,
            content: this.content,
            tags1: this.tags1,
            tags2: this.tags2,
            tags3: this.tags3,
            tags4: this.tags4,
            special: 0,
            public: 0,
            start_time: parseDate(this.start_time, "encode")
        };
        if (this.special) result.special = 1;
        if (this.public) result.public = 1;
        if (!exporting_new) result.id = this.id;
        return result
    }

    htmlStartTime() {
        if (this.start_time.minute < 10) return this.start_time.hour + ":0" + this.start_time.minute;
        return this.start_time.hour + ":" + this.start_time.minute;
    }

    htmlStartDate() {
        return this.start_time.day + "." + this.start_time.month;
    }

    htmlTags4() {
        let result = '';
        if (this.tags4 && this.tags4.length) {
            let temp = this.tags4.split("|");
            temp.forEach(function(t) {
                t = t.toLowerCase();
                result += '<span class="tag category tag-' + t + '">' + translateTag(t) + '</span> ';
            });
        }
        return result;
    }

    htmlTags2() {
        let result = '';
        if (this.tags2 && this.tags2.length) {
            let temp = this.tags2.split("|");
            temp.forEach(function(t) {
                t = t.toLowerCase();
                result += '<span class="tag tag-' + t + '">' + translateTag(t) + '</span> ';
            });
        }
        return result;
    }
}