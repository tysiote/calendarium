function parseResponse(res) {
    let result = JSON.parse(res);
    result.forEach(function(e) {
        e.start_time = parseDate(e.start_time, "decode");
        e.id = parseInt(e.id);
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

        result.sortingvalue = result.hour.toString() + "";
        if (result.sortingvalue.length === 1) result.sortingvalue = "0" + result.sortingvalue;
        if (result.minute < 10) result.sortingvalue += "0" + result.minute.toString();
        else result.sortingvalue += result.minute.toString();

        result.sortingvaluedate = result.year.toString() + "";
        if (result.month < 10) result.sortingvaluedate += "0" + result.month.toString();
        else result.sortingvaluedate += result.month.toString();
        if (result.day < 10) result.sortingvaluedate += "0" + result.day.toString();
        else result.sortingvaluedate += result.day.toString();
        result.sortingvaluedate += result.sortingvalue;

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
    if (typeof input === "string") {
        if (months.indexOf(input.toLowerCase()) !== -1) return months.indexOf(input.toLowerCase()) + 1;
        if (months2.indexOf(input.toLowerCase()) !== -1) return months2.indexOf(input.toLowerCase()) + 1;
    }
    if (typeof input === "number" && input >= 0 && input < 12) return months[input].substr(0, 1).toUpperCase() + months[input].substr(1, months[input].length).toLowerCase();
    return false;
}

function parseWeekDay(input) {
    let days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    if (days.indexOf(input.toLowerCase()) !== -1) return days.indexOf(input.toLowerCase());
    return false;
}

function translateWeekDay(input, shifted) {
    let days = ["pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota", "nedeľa"];
    if (shifted) days = ["nedeľa", "pondelok", "utorok", "streda", "štvrtok", "piatok", "sobota"];
    if (input !== false) return days[input];
    return false
}

function parseMonthSlovak(index) {
    let months = ["januára", "februára", "marca", "apríla", "mája", "júna", "júla", "augusta", "septembra", "októbra", "novembra", "decembra"];
    return months[index];
}

function parseTextToSearch(input) {
    let dict = {
        "á": "a",
        "ä": "a",
        "č": "c",
        "ď": "d",
        "é": "e",
        "ě": "e",
        "í": "i",
        "ľ": "l",
        "ĺ": "l",
        "ň": "n",
        "ó": "o",
        "ô": "o",
        "ö": "o",
        "ř": "r",
        "ŕ": "r",
        "š": "s",
        "ť": "t",
        "ú": "u",
        "ü": "u",
        "ý": "y",
        "ž": "z"
    };
    let result = input.toLowerCase();
    for (let key in dict) result = customReplace(result, key, dict[key]);
    return result;
}