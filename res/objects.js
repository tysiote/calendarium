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

    update(temp) {
        console.log(temp);
        let old = this.get(temp.id);
        old.title = temp.title;
        old.id = temp.id;
        old.content = temp.content;
        old.content = old.content.replace(/\\r\\n/g, "<br>");
        old.content = old.content.replace(/\\n/g, "<br>");
        old.tags1 = temp.tags1;
        old.tags2 = temp.tags2;
        old.tags3 = temp.tags3;
        old.tags4 = temp.tags4;

        if (typeof temp.special === "string") {
            if (temp.special === "0") old.special = false;
            else old.special = true;
        } else old.special = temp.special;

        if (typeof temp.public === "string") {
            if (temp.public === "0") old.public = false;
            else old.public = true;
        } else old.public = temp.public;
        old.sortingvalue = temp.start_time.sortingvalue;
        old.start_time = temp.start_time;
    }

    remove(event) {
        this.events.splice(this.events.indexOf(event), 1);
    }

    years() {
        let result = [];
        this.events.forEach(function(e) {if (result.indexOf(e.start_time.year) === -1) result.push(e.start_time.year);});
        result.sort(function(a, b) {return a - b;});
        return result;
    }

    filterByYear(yr) {
        let result = [];
        this.events.forEach(function(e) {if (e.start_time.year === yr) result.push(e);});
        return this.sorted(result, "date");
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
        let result4 = [];
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

        if (active_filters.forms.length) {
            subset.forEach(function(e) {
                let passed = false;
                active_filters.forms.forEach(function(f) {if (e.tags4.indexOf(f) !== -1) passed = true;});
                if (passed) result3.push(e);
            });
        } else subset.forEach(function(e) {result3.push(e);});

        if (active_filters.search.length) {
            subset.forEach(function(e) {
                if (parseTextToSearch(e.title).indexOf(parseTextToSearch(active_filters.search)) !== -1) result3.push(e);
            });
        } else subset.forEach(function(e) {result4.push(e);});
        subset.forEach(function(e) {
            if (result1.indexOf(e) !== -1 && result2.indexOf(e) !== -1 && result3.indexOf(e) !== -1 && result4.indexOf(e) !== -1) result.push(e);
        });
        return result;
    }

    sorted(subset, key) {
        if (key === "time") {
            return _.sortBy(subset, 'sortingvalue');
        }
        if (key === "date") {
            return _.sortBy(subset, 'sortingvaluedate');
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
        this.sortingvaluedate = data.start_time.sortingvaluedate;
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
        if (!exporting_new) {
            result.id = this.id;
        }
        return result
    }

    htmlStartTime() {
        if (this.start_time.minute < 10) return this.start_time.hour + ":0" + this.start_time.minute;
        return this.start_time.hour + ":" + this.start_time.minute;
    }

    htmlStartDate() {
        return this.start_time.day + "." + parseMonthSlovak(this.start_time.month - 1);
    }

    htmlTags2(non_html) {
        let result = '';
        if (this.tags2 && this.tags2.length) {
            let temp = this.tags2.split("|");
            temp.forEach(function(t) {
                t = t.toLowerCase();
                if (non_html) result += translateTag(t) + ", ";
                else result += '<span class="tag tag-' + t + '">' + translateTag(t) + '</span> ';
            });
            if (non_html) result = result.substring(0, result.length - 2);
        }
        return result;
    }
}