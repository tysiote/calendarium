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
    if (d[0] === "0") d = d[1];
    let select_all = '';
    let export_html = 'Exportovať';
    let export_button = '';
    let export_button_class = 'btn-default';
    let filters = '';
    if (exporting) {
        select_all = '' +
            '<div class="row custom-row">' +
                '<div class="col-lg-8 col-md-8 col-sm-6">' +
                    '<div class="select-all-checkbox">' +
                        '<div class="checkbox checkbox-primary row-checkbox">' +
                            '<input type="checkbox" value="" id="select-all-checkbox">' +
                            '<label for="select-all-checkbox" onclick="selectAll();">Označ všetky</label>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="col-lg-4 col-md-4 col-sm-6">' +
                    '<button type="button" class="btn btn-success export-button-options" onclick="exportMainPressed(true);">Exportovať s popismi</button>' +
                    '<button type="button" class="btn btn-info export-button-options" onclick="exportMainPressed(false);">Exportovať len titulky</button>' +
                '</div>' +
            '</div>';
        export_html = 'Zrušiť exportovanie';
        export_button_class = 'btn-danger';
    }
    if (daily_events && daily_events.length) {
        filters = '<button type="button" class="btn btn-primary filter-button" onclick="openFilters();">Možnosti filtrov</button>';
        export_button = '<button type="button" class="btn ' + export_button_class + ' export-button" id="export-button" onclick="exportPressed();">' + export_html + '</button>';
    }
    result = '' +
        '<div class="row custom-row">' +
            '<div class="col-lg-10 col-md-8 col-sm-8">' +
                '<h3 class="daily-event-title">Udalosti z dňa ' + translateWeekDay(parseWeekDay(wd)) + ', ' + d + '.' + m + '.' + y + '</h3><br>' +
            '</div>' +
            '<div class="col-lg-1 col-md-2 col-sm-2">' + export_button + '</div>' +
            '<div class="col-lg-1 col-md-2 col-sm-2">' + filters + '</div>' +
        '</div>';
    result += select_all;
    if (daily_events && daily_events.length) {
        daily_events.forEach(function(e) {
            result += populateOneEvent(e);
        });
    } else {
        result += "<p class='jumbo-info'>Pre zadaný dátum neexistujú žiadne dáta</p>";
    }
    $main.html(result);
    validateExportOptionsButtons();
}

function populateOneEvent(e) {
    let checkbox_exporting = '';
    let checkbox_ending = '';
    if (exporting) {
        checkbox_exporting = '' +
            '<div class="row custom-row">' +
                '<div class="col-lg-1 col-md-1 col-sm-1 custom-col">' +
                    '<div class="checkbox checkbox-primary row-checkbox"><input type="checkbox" value="" id="event-row-' + e.id + '-checkbox" class="dummy-selector-class-checkbox"><label for="event-row-' + e.id + '-checkbox" class="checkbox-inline" onclick="validateExportOptionsButtons();"></label></div>' +
                '</div>' +
                '<div class="col-lg-11 col-md-11 col-sm-11 custom-col">';
        checkbox_ending = '</div></div>';
    }
    let result = '';
    result += checkbox_exporting +
        '<button data-toggle="collapse" data-target="#cal-row-div-' + e.id + '" class="event-btn">' +
            '<div class="row custom-row" id="cal-row-' + e.id + '">' +
                '<div class="col-lg-8 col-md-6 col-sm-8 custom-col"><div class="event-title">[' + e.htmlStartTime() + '] ' + e.title + '</div></div>' +
                '<div class="col-lg-2 col-md-3 col-sm-2 custom-col">' + e.htmlTags1() + '</div>' +
                '<div class="col-lg-2 col-md-3 col-sm-2 custom-col">' + e.htmlTags2() + '</div>' +
            '</div>' +
        '</button>' +
        '<div id="cal-row-div-' + e.id + '" class="collapse"><div class="event-content">' + e.content + '</div></div>' + checkbox_ending;
    return result;
}