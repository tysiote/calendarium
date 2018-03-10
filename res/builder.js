function drawMain() {

}

function mainDateChanged(e) {
    if (e && e.length) {
        last_date = e;
        let m = e.split(" ")[1];
        let d = e.split(" ")[2];
        let y = e.split(" ")[3];
        let wd = e.split(" ")[0];
        loadSelectedDates(d, parseMonth(m), y, wd);
    }
}

function loadSelectedDates(d, m, y, wd) {
    let $main = $("#main-jumbotron");
    let result = '';
    let daily_events = events.filterDay(d, m, y);
    result = '<h3 class="daily-event-title">Udalosti z dňa ' + translateWeekDay(parseWeekDay(wd)) + ', ' + d + '.' + m + '. ' + y + '</h3>';
    if (exporting) result += '<button type="button" class="btn btn-primary export-button" id="export-button" onclick="exportPressed();">Exportujem</button>';
    else result += '<button type="button" class="btn btn-primary export-button" id="export-button" onclick="exportPressed();">Export</button>';
    if (daily_events && daily_events.length) {
        daily_events.forEach(function(e) {
            result += populateOneEvent(e);
        });
    } else {
        result += "<p class='jumbo-info'>Pre zadaný dátum neexistujú žiadne dáta</p>";
    }
    $main.html(result);
}

function populateOneEvent(e) {
    if (exporting) {
        console.log("EXPORTING");
    }
    let result = '';
    result += '' +
        '<button data-toggle="collapse" data-target="#cal-row-div-' + e.id + '" class="event-btn">' +
            '<div class="row custom-row" id="cal-row-' + e.id + '">' +
                '<div class="col-lg-9 col-md-6 col-sm-9 custom-col"><div class="event-title">[' + e.htmlStartTime() + '] ' + e.title + '</div></div>' +
                '<div class="col-lg-3 col-md-6 col-sm-3 custom-col">' + e.htmlTags2() + '</div>' +
            '</div>' +
        '</button>' +
        '<div id="cal-row-div-' + e.id + '" class="collapse"><div class="event-content">' + e.content + '</div></div>';
    return result;
}