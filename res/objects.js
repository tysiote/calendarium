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
        return this.sorted(result, "time");
    }

    sorted(subset, key) {
        if (key === "time") {
            subset.forEach(function(e) {e.formatted_time = e.start_time.hour + ":" + e.start_time.minute});
            console.log(subset);
            subset = subset.sort(function(a, b) {
                return ((a.formatted_time < b.formatted_time) ? -1 : ((a.formatted_time > b.formatted_time) ? 1 : 0));
            });
            console.log(subset);
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
        this.start_time = data.start_time;
    }

    exportToPost(exporting_new) {
        let result = {
            title: this.title,
            content: this.content,
            tags1: this.tags1,
            tags2: this.tags2,
            start_time: parseDate(this.start_time, "encode")
        };
        if (!exporting_new) result.id = this.id;
        return result
    }

    htmlStartTime() {
        if (this.start_time.minute < 10) return this.start_time.hour + ":0" + this.start_time.minute;
        return this.start_time.hour + ":" + this.start_time.minute;
    }

    htmlTags1() {
        let result = '';
        if (this.tags1 && this.tags1.length) {
            let temp = this.tags1.split("|");
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