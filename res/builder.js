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
        '<button type="button" class="btn btn-sidebar btn-sidebar-small" onclick="exportMainPressed();">Exportovať vybrané</button>' +
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
        result = '<h3 class="daily-event-title">' +
            '<span id="daily-header">Udalosti z dňa ' + translateWeekDay(parseWeekDay(wd)) + ', ' + d + '.' + m + '.' + y + '</span>' +
            '<span><button type="button" id="adding-btn" class="btn btn-primary" onclick="addEvent()">Pridať novú udalosť</button></span>' +
            '</h3>';
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
    if (LEVEL !== 3) $("#adding-btn").hide();
}

function populateOneEvent(e, day, odd) {
    let odd_class = " stripped-custom-row-0 ";
    if (odd) odd_class = " stripped-custom-row-1 ";
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
    let event_controls = '';
    if (day) html_date = e.htmlStartDate() + " ";
    let title_class = "event-title";
    if (LEVEL === 3) {
        event_controls = '' +
            '<button type="button" class="btn fa-button" id="' + e.id + '" onclick="editEvent(this);"><i class="fa fa-pencil"></i></button> ' +
            '<button type="button" class="btn fa-button" id="' + e.id + '" onclick="deleteEvent(this);"><i class="fa fa-trash"></i></button> ' +
            '';
    }
    result += '' +
            '<div class="row custom-row ' + odd_class + '" id="cal-row-' + e.id + '">' +
                '<div class="col-lg-9 col-md-9 col-sm-9 custom-col">' +
                    checkbox_exporting +
                    '<div class="' + title_class + '">' +
                        event_controls +
                        '<button data-toggle="collapse" onclick="resizeMain();" data-target="#cal-row-div-' + e.id + '" class="event-btn event-btn-admin">' +
                            html_date + '[' + e.htmlStartTime() + '] ' + e.htmlTodayEvent() + e.title + '' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="col-lg-3 col-md-3 col-sm-3 custom-col">' + e.htmlTags2() + '</div>' +
            '</div>' +
        '<div id="cal-row-div-' + e.id + '" class="collapse"><div class="event-content">' + customReplace(e.content, "&nbsp;", " ") + '</div></div>';
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

function addNewEventModalShow() {
    let $modal = $("#add-new-event");
    $("input").each(function(i, v) {
        $(v).val("");
        $(v).prop("checked", false);
    });
    $modal.modal('show');
}