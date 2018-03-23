function openViews() {
    $("#views-modal").modal("show");
    let body = $("#views-modal-body");
    let result = '';
    result += '' +
        '<div class="form-group">' +
            '<label for="input-checkboxes">Základné zobrazenie</label>' +
            '<div class="form-group" id="input-views">' +
                '<div class="radio radio-primary"><input type="radio" value=1 name="views-radio" id="input-views-day"><label for="input-views-day" class="radio-inline">Deň</label></div>' +
                '<div class="radio radio-primary"><input type="radio" value=2 name="views-radio" id="input-views-week"><label for="input-views-week" class="radio-inline">Týždeň</label></div>' +
                '<div class="radio radio-primary"><input type="radio" value=3 name="views-radio" id="input-views-month"><label for="input-views-month" class="radio-inline">Mesiac</label></div>' +
            '</div>' +
        '</div>' +
        '<div class="view-additional-info" id="view-additional-info"></div>';
    body.html(result);
    $("#input-views-" + viewing_mode).prop('checked', true);
    $("input[name='views-radio']").change(function() {radioClicked();});
    radioClicked();
}

function radioClicked() {
    let mode = 'day';
    let result = '';
    let additional = $("#view-additional-info");
    ["day", "week", "month"].forEach(function(v) {if ($("#input-views-" + v).prop('checked')) mode = v;});
    if (mode === "week") {
        result += '<select class="views-weeks-select" id="views-weeks-select">';
        getRemainingWeeks(default_weeks).forEach(function(w) {
            result += '<option>Týždeň ' + w[0].getDate() + '.' + (w[0].getMonth()+1).toString() + ' - ' + w[1].getDate() + '.' + (w[1].getMonth()+1).toString() + '</option>';
        });
        result += '</select>';
    } else if (mode === "month") {
        result += '<select class="views-weeks-select" id="views-months-select">';
        getRemainingMonths(default_months).forEach(function(m) {
            result += '<option>' + m + '</option>';
        });
    }
    additional.html(result);
}

function viewChanged(mode, params) {
    viewing_mode = mode;
    viewing_params = params;
    console.log(params);
    if (mode === "day") invokeCalendarClick();
    else {
        $("#main-datepicker").hide();
        let select_all = '';
        if (exporting) {
            select_all = '' +
                '<div class="row custom-row">' +
                    '<div class="col-lg-12 col-md-12 col-sm-12">' +
                        '<div class="checkbox checkbox-primary row-checkbox">' +
                            '<input type="checkbox" value="" id="select-all-checkbox">' +
                            '<label for="select-all-checkbox" onclick="selectAll();">Označ všetky</label>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
        let $el = $("#main-jumbotron");
        let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        let check_count = false;
        let error = "<p class='jumbo-info'>Pre zadaný dátum neexistujú žiadne dáta</p>";
        if (mode === "month") {
            $el.html('<h2 class="month-week-title">Prehľad udalostí na mesiac ' + params + '</h2>' + select_all);
            let y = new Date().getFullYear();
            let months_count = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (y % 4 === 0) months_count[1] = 29;
            let m = parseMonth(params);
            for (let i = 1; i < months_count[m]; i++) {
                let shown_events = events.filterDay(i, m, y);
                if (shown_events && shown_events.length) {
                    check_count = true;
                    $el.html($el.html() + '<div class="month-separator" id="month-events-' + i + '"></div>');
                    loadSelectedDates(i, m, y, days[new Date(i, m, y).getDay()], $("#month-events-" + i), true);
                }
            }
            validateExportOptionsButtons();
        } else {
            $el.html('<h2 class="month-week-title">Prehľad udalostí na ' + params.toLowerCase() + '</h2>' + select_all);
            let d1 = parseInt(params.split(" ")[1].split(".")[0]);
            let d2 = parseInt(params.split(" ")[3].split(".")[0]);
            let m1 = parseInt(params.split(" ")[1].split(".")[1]);
            let m2 = parseInt(params.split(" ")[3].split(".")[1]);
            let y1 = new Date().getFullYear();
            if (new Date().getMonth() > m1) y++;
            let y2 = y1;
            if (m1 > m2) y2++;
            let date1 = new Date(y1, m1, d1);
            let dates = [];
            let day_const = 24*60*60*1000;
            for (let i = 0; i < 7; i++) dates.push(new Date(date1.getTime() + i*day_const));
            dates.forEach(function(dd) {
                let shown_events = events.filterDay(dd.getDate(), dd.getMonth(), dd.getFullYear());
                if (shown_events && shown_events.length) {
                    check_count = true;
                    $el.html($el.html() + '<div class="month-separator" id="week-events-' + dd.getDate() + '"></div>');
                    loadSelectedDates(dd.getDate(), dd.getMonth(), dd.getFullYear(), days[new Date(dd.getFullYear(), dd.getMonth(), dd.getDate()).getDay()], $("#week-events-" + dd.getDate()), true);
                }
            });
        }
        if (!check_count) $el.html($el.html() + error);
    }
}

function setView() {
    let mode = "day";
    ["day", "week", "month"].forEach(function(v) {if ($("#input-views-" + v).prop('checked')) mode = v;});
    if (mode === "day") viewChanged(mode);
    if (mode === "week") viewChanged(mode, $("#views-weeks-select option:selected").text());
    if (mode === "month") viewChanged(mode, $("#views-months-select option:selected").text());
    $("#views-modal").modal("hide");
}

function getRemainingWeeks(n, ty, tm, td) {
    if (!n) n = default_weeks;
    let result = [];
    if (ty !== undefined) {
        let days = getDaysElapsed(ty, tm, td);
        let monday = getLastMonday(days, ty);
        for (let i = 0; i < n; i++) result.push(createViewWeek(monday + i*7, ty))
        return result;
    } else {
        let days = getDaysElapsed();
        let monday = getLastMonday(days);
        for (let i = 0; i < n; i++) result.push(createViewWeek(monday + i*7))
        return result;
    }
}

function getRemainingMonths(n) {
    if (!n) n = default_months;
    let result = [];
    let d = new Date();
    if (d.getMonth() + n > 12) {
        for (let i = d.getMonth(); i < 12; i++) result.push(parseMonth(i))
        for (let i = 0; i < d.getMonth() + n - 12; i++) result.push(parseMonth(i))
    } else for (let i = d.getMonth(); i < d.getMonth() + n; i++) result.push(parseMonth(i))
    return result;
}

function createViewWeek(monday, yr) {
    let result = [];
    let months_count = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (new Date().getFullYear() % 4 === 0) months_count[1] = 29;
    let i = 0;
    while (months_count[i] < monday) {
        monday -= months_count[i];
        i++;
    }
    let d1 = new Date(new Date().getFullYear(), i, monday);
    let d2;
    if (yr) d1 = new Date(yr, i, monday);
    if (months_count[i] > monday + 6) d2 = new Date(d1.getFullYear(), i, monday + 6);
    else {
        if (i < 11) d2 = new Date(d1.getFullYear(), i + 1, monday + 6 - months_count[i]);
        else d2 = new Date(d1.getFullYear() + 1, 0, monday + 6 - months_count[i]);
    }
    result.push(d1);
    result.push(d2);
    return result;
}

function getDaysElapsed(ty, tm, td) {
    let d = new Date();
    if (ty) d = new Date(ty, tm, td);
    let months_count = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (d.getFullYear() % 4 === 0) months_count[1] = 29;
    let days = 0;
    for (let i = 0; i < d.getMonth(); i++) days += months_count[i];
    days += d.getDate();
    return days;
}

function getLastMonday(days, yr) {
    let monday;
    let i = 1;
    if (!yr) yr = new Date(new Date().getFullYear());
    while (monday === undefined) {
        let d = new Date(yr, 0, i);
        if (d.getDay() === 1) monday = d.getDate();
    }
    while (monday + 7 <= days) monday += 7;
    return monday;
}
