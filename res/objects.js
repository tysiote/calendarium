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
        return result;
    }
}

class Event {
    constructor(data) {
        this.title = data.title;
        this.id = data.id;
        this.content = data.content;
        this.tags = data.tags;
        this.start_time = data.start_time;
    }

    exportToPost(exporting_new) {
        let result = {
            title: this.title,
            content: this.content,
            tags: this.tags,
            start_time: parseDate(this.start_time, "encode")
        };
        if (!exporting_new) result.id = this.id;
        return result
    }

    htmlStartTime() {
        if (this.start_time.minute < 10) return this.start_time.hour + ":0" + this.start_time.minute;
        return this.start_time.hour + ":" + this.start_time.minute;
    }

    htmlTags() {
        let result = '';
        if (this.tags && this.tags.length) {
            let temp = this.tags.split("|");
            temp.forEach(function(t) {
                t = t.toLowerCase();
                result += '<span class="tag tag-' + t + '">' + translateTag(t) + '</span> ';
            });
        }
        return result;
    }
}