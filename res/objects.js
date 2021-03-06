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
        old.tags5 = temp.tags5;
        old.sport_type = temp.sport_type;

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
        let result5 = [];
        let result6 = [];
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

        if (active_filters.tags.length) {
            subset.forEach(function(e) {
                let passed = false;
                active_filters.tags.forEach(function(f) {if (e.tags2.indexOf(f) !== -1) passed = true;});
                if (passed) result4.push(e);
            });
        } else subset.forEach(function(e) {result4.push(e);});

        if (active_filters.sports.length) {
            subset.forEach(function(e) {
                let passed = false;
                active_filters.sports.forEach(function(f) {if (e.sport_type.indexOf(f) !== -1) passed = true;});
                if (passed) result5.push(e);
            });
        } else subset.forEach(function(e) {result5.push(e);});

        if (active_filters.search.length) {
            subset.forEach(function(e) {
                if (parseTextToSearch(e.title).indexOf(parseTextToSearch(active_filters.search)) !== -1) result6.push(e);
            });
        } else subset.forEach(function(e) {result6.push(e);});
        
        subset.forEach(function(e) {
            if (
                result1.indexOf(e) !== -1 &&
                result2.indexOf(e) !== -1 &&
                result3.indexOf(e) !== -1 &&
                result4.indexOf(e) !== -1 &&
                result5.indexOf(e) !== -1 &&
                result6.indexOf(e) !== -1
            ) result.push(e);
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
        this.content = '';
        if (data.content && data.content.length) {
            this.content = data.content;
            this.content = this.content.replace(/\\r\\n/g, "<br>");
            this.content = this.content.replace(/\\n/g, "<br>");
            this.content = customReplace(this.content, " ", "&nbsp;");
            this.content = customReplace(this.content, "\n", "<br>");
        }
        this.tags1 = data.tags1;
        this.tags2 = data.tags2;
        this.tags3 = data.tags3;
        this.tags4 = data.tags4;
        this.tags5 = data.tags5;
        this.sport_type = data.sport_type;
        this.deleted = false;
        this.edited = false;
        this.added = false;
        this.added_date = data.added;
        this.edited_date = data.edited;
        this.deleted_date = data.deleted;

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
        this.recalculateDates();
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

    recalculateDates() {
        let d = new Date();
        if (this.added_date) this.added = parseInt(this.added_date.split("-")[0]) === d.getFullYear() && parseInt(this.added_date.split("-")[1]) === d.getMonth() + 1 && parseInt(this.added_date.split(" ")[0].split("-")[2]) === d.getDate();
        if (this.edited_date) this.edited = parseInt(this.edited_date.split("-")[0]) === d.getFullYear() && parseInt(this.edited_date.split("-")[1]) === d.getMonth() + 1 && parseInt(this.edited_date.split(" ")[0].split("-")[2]) === d.getDate();
        if (this.deleted_date) this.deleted = parseInt(this.deleted_date.split("-")[0]) === d.getFullYear() && parseInt(this.deleted_date.split("-")[1]) === d.getMonth() + 1 && parseInt(this.deleted_date.split(" ")[0].split("-")[2]) === d.getDate();
        if (d.getFullYear() !== this.start_time.year || d.getMonth() + 1 !== this.start_time.month || d.getDate() !== this.start_time.day) {
            if (this.added_date) this.added = false;
            if (this.edited_date) this.edited = false;
            if (this.deleted_date) this.deleted = false;
        }
        if (this.edited_date) this.edited = false; // PERMANENTLY DISABLED
    }

    htmlTodayEvent() {
        let result = '';
        this.recalculateDates();
        if (this.added) {result = '<span class="event-added"> Pridané dnes! </span>';}
        if (this.edited) {result = '<span class="event-edited"> Zmenené dnes! </span>';}
        if (this.deleted) {result = '<span class="event-deleted"> Zrušené dnes! </span>';}
        return result;
    }
}