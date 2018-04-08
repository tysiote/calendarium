function drawMain() {

}

function mainDateChanged(e) {
    if (e && e.length) {
        last_date = e;
        let m = e.split(" ")[1];
        let d = e.split(" ")[2];
        let y = e.split(" ")[3];
        let wd = e.split(" ")[0];
        loadSelectedDates(d, parseMonth(m), y, wd, $("#main-jumbotron"));
    }
}

function buildOtherNavigation(rows) {
    let result = '';
    let nav_obj = $("#other-navigation");
    result += '' +
        '<button type="button" class="btn btn-lg btn-sidebar" onclick="openFilters();">Filter</button>' +
        '<button type="button" class="btn btn-lg btn-sidebar" onclick="openViews();">Zobrazenie</button>' +
        '<button type="button" class="btn btn-lg btn-sidebar" id="export-button-default" onclick="exportPressed(this);">Export</button>' +
        '<button type="button" class="btn btn-lg btn-sidebar" id="export-button-active" onclick="exportPressed(this);">Zrušiť export</button>' +
        '<button type="button" class="btn btn-sidebar btn-sidebar-small" onclick="exportMainPressed(true);">Exportovať s popismi</button>' +
        '<button type="button" class="btn btn-sidebar btn-sidebar-small" onclick="exportMainPressed(false);">Exportovať len titulky</button>' +
        // '<button type="button" class="btn btn-sidebar btn-sidebar-small" id="export-button-raw" onclick="exportRaw();">Technický export</button>' +
        '';
    nav_obj.html(result);
    let export_default = $("#export-button-default");
    let export_active = $("#export-button-active");
    if (!rows.length) {
        export_default.hide();
        export_active.hide();
        $(".btn-sidebar-small").each(function(i, v) {$(v).hide();});
    } else {
        if (exporting) {
            export_default.hide();
            export_active.show();
            $(".btn-sidebar-small").each(function(i, v) {$(v).show();});
        } else {
            export_default.show();
            export_active.hide();
            $(".btn-sidebar-small").each(function(i, v) {$(v).hide();});
        }
    }
}

function loadSelectedDates(d, m, y, wd, parent, bulk) {
    let result = '';
    let shown_events = events.filterDay(d, m, y);
    if (d[0] === "0") d = d[1];
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
    buildOtherNavigation(shown_events);
    let i = 0;
    if (!bulk) {
        result = '<h3 class="daily-event-title">Udalosti z dňa ' + translateWeekDay(parseWeekDay(wd)) + ', ' + d + '.' + m + '.' + y + '</h3>';
        result += select_all;
        if (shown_events && shown_events.length) {
            shown_events.forEach(function(e) {
                result += populateOneEvent(e, null, i % 2 === 0);
                i++;
            });
        } else {
            result += "<p class='jumbo-info'>Pre zadaný dátum neexistujú žiadne dáta</p>";
        }
        parent.html(result);
        validateExportOptionsButtons();
    } else {
        if (shown_events && shown_events.length) {
            shown_events.forEach(function(e) {
                result += populateOneEvent(e, true, i % 2 === 0);
                i++;
            });
        }
        parent.html(result);
    }

}

function populateOneEvent(e, day, odd) {
    let deleted = false;
    let added = false;
    let edited = false;
    let odd_class = " stripped-custom-row-0 ";
    if (odd) odd_class = " stripped-custom-row-1 ";
    if (e.deleted) {
        if (viewing_mode === "day") {
            let datetime = $('#main-datepicker').data("DateTimePicker").viewDate()._d.toString();
            let m = parseMonth(datetime.split(" ")[1]);
            let d = parseInt(datetime.split(" ")[2]);
            let y = parseInt(datetime.split(" ")[3]);
            let new_date = new Date();
            console.log(new_date.getDate() !== d, new_date.getMonth()+1 !== m, new_date.getFullYear() !== y);
            if (new_date.getDate() !== d || new_date.getMonth()+1 !== m || new_date.getFullYear() !== y) return "";
            deleted = true;
        } else return "";
    }
    if (e.added) {
        if (viewing_mode === "day") {
            let datetime = $('#main-datepicker').data("DateTimePicker").viewDate()._d.toString();
            let m = parseMonth(datetime.split(" ")[1]);
            let d = parseInt(datetime.split(" ")[2]);
            let y = parseInt(datetime.split(" ")[3]);
            let new_date = new Date();
            console.log(new_date.getDate() !== d, new_date.getMonth()+1 !== m, new_date.getFullYear() !== y);
            if (new_date.getDate() !== d || new_date.getMonth()+1 !== m || new_date.getFullYear() !== y) return "";
            added = true;
        } else return "";
    }
    if (e.edited) {
        if (viewing_mode === "day") {
            let datetime = $('#main-datepicker').data("DateTimePicker").viewDate()._d.toString();
            let m = parseMonth(datetime.split(" ")[1]);
            let d = parseInt(datetime.split(" ")[2]);
            let y = parseInt(datetime.split(" ")[3]);
            let new_date = new Date();
            console.log(new_date.getDate() !== d, new_date.getMonth()+1 !== m, new_date.getFullYear() !== y);
            if (new_date.getDate() !== d || new_date.getMonth()+1 !== m || new_date.getFullYear() !== y) return "";
            edited = true;
        } else return "";
    }
    let checkbox_exporting = '';
    if (exporting) {
        checkbox_exporting = '' +
            '<div class="checkbox checkbox-primary checkbox-inline row-checkbox">' +
                '<input type="checkbox" value="" id="event-row-' + e.id + '-checkbox" class="dummy-selector-class-checkbox">' +
                '<label for="event-row-' + e.id + '-checkbox" class="checkbox-inline" onclick="validateExportOptionsButtons();"></label>' +
            '</div>';
    }
    let result = '';
    let html_date = '';
    if (day) html_date = e.htmlStartDate() + " ";
    let title_class = "event-title";
    if (e.special) title_class += " special-event";
    // if (added) title_class += " event-added";
    // if (edited) title_class += " event-edited";
    // if (deleted) title_class += " event-deleted";
    result += '' +
            '<div class="row custom-row ' + odd_class + '" id="cal-row-' + e.id + '">' +
                '<div class="col-lg-9 col-md-9 col-sm-9 custom-col">' +
                    checkbox_exporting +
                    '<div class="' + title_class + '">' +
                        '<button data-toggle="collapse" data-target="#cal-row-div-' + e.id + '" class="event-btn">' +
                            html_date + '[' + e.htmlStartTime() + '] ' + e.htmlTodayEvent() + e.title + '' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="col-lg-3 col-md-3 col-sm-3 custom-col">' + e.htmlTags2() + '</div>' +
            '</div>' +
        '<div id="cal-row-div-' + e.id + '" class="collapse"><div class="event-content">' + e.content + '</div></div>';
    return result;
}

function oneDate(i) {
    i++;
    let result = '';
    result += '' +
        '<div class="input-group date" id="datetimepicker' + i + '">' +
            '<input type="text" class="form-control" id="input-date-' + i + '" placeholder="Použite ikonu napravo" />' +
            '<span class="input-group-addon">' +
                '<span class="glyphicon glyphicon-calendar"></span>' +
            '</span>' +
        '</div>';
    return result;
}

function moreDates(inc) {
    let $controls = $("#dates-controls");
    let result = '';
    let old_values = [];
    if (inc > 0) {
        dates_active++;
        $controls.html('' +
            '<button type="button" class="btn btn-primary btn-date-option" onclick="moreDates(1);">Pridajte deň</button>' +
            '<button type="button" class="btn btn-default btn-date-option" onclick="moreDates(-1);">Odoberte deň</button>'
        );
    } else {
        dates_active += inc;
        if (dates_active === 0) dates_active = 1;
        if (dates_active === 1) {
            $controls.html('<button type="button" class="btn btn-success" onclick="moreDates(1);">Pridajte deň</button>');
        }
    }
    for (let i = 1; i < dates_active; i++) {
        result += oneDate(i);
        old_values[i] = $("#input-date-" + (i + 1)).val();
    }
    console.log(old_values);
    $("#more-dates").html(result);
    for (let i = 1; i < dates_active; i++) {
        $(function () {$('#datetimepicker' + (i + 1)).datetimepicker({locale: 'sk', format: 'LLLL'});});
        if (old_values[i]) $("#input-date-" + (i + 1)).val(old_values[i]);
    }
}