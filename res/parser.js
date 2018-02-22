function parseResponse(res) {
    let result = [];
    res = res.replace("}", "").replace("[", "").replace("]", "");
    res.split("{").forEach(function(t) {
        if (t.length) {
            let res_obj = {};
            t = t.substring(0, t.length - 1).replace(/",/g, "~");
            t.split("~").forEach(function(t2) {
                t2 = t2.substring(1, t2.length);
                let temp = '';
                let t3 = '';
                for (let i = 0; i < t2.length; i++) {
                    if (t2[i] === '"') {
                        if (t3.length === 2) {
                            t3 = "";
                            temp += "~";
                        }
                        else {
                            if (t3.length === 0) {
                                t3 = '"';
                            }
                        }
                    } else if (t2[i] === ":") {
                        if (t3.length === 1) t3 += ":";
                        else {
                            temp += t3 + t2[i];
                            t3 = '';
                        }
                    } else {
                        temp += t3 + t2[i];
                        t3 = '';
                    }
                }
                let t4 = temp.split("~");
                res_obj[t4[0]] = t4[1];
            });
            if (res_obj['id']) res_obj['id'] = parseInt(res_obj['id']);
            if (res_obj['start_time']) res_obj['start_time'] = parseDate(res_obj['start_time'], "decode");
            result.push(res_obj);
        }
    });
    return result;
}

function parseDate(input, type) {
    if (type === "encode") {
        return input.year + "-" + input.month + "-" + input.day + " " + input.hour + "-" + input.minute;
    }
    if (type === "decode") {
        let result = {};
        let date = input.split(" ")[0];
        let time = input.split(" ")[1];
        result.year = parseInt(date.split("-")[0]);
        result.month = parseInt(date.split("-")[1]);
        result.day = parseInt(date.split("-")[2]);
        result.hour = parseInt(time.split(":")[0]);
        result.minute = parseInt(time.split(":")[1]);
        return result;
    }
    return null;
}

function parsePostData(obj) {
    console.log(obj);
    let result = "";
    for (let key in obj) result += key + "=" + obj[key].toString() + "&";
    return result.substring(0, result.length - 1);
}

function parseMonth(input) {
    let months = ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"];
    let months2 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    if (months.indexOf(input.toLowerCase()) !== -1) return months.indexOf(input.toLowerCase()) + 1;
    if (months2.indexOf(input.toLowerCase()) !== -1) return months2.indexOf(input.toLowerCase()) + 1;
    return false;
}

function parseWeekDay(input) {
    let days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (days.indexOf(input.toLowerCase()) !== -1) return days.indexOf(input.toLowerCase());
    return false;
}

function translateWeekDay(input) {
    let days = ["pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota", "nedeľa"];
    if (input !== false) return days[input];
    return false
}