let events = new Events();
let exporting = false;
let last_date = null;
let active_filters = {
    search: "",
    classes: [],
    areas: [],
    forms: []
};
let viewing_mode = "day";
let viewing_params = "";
let default_weeks = 5;
let default_months = 3;
let deleting_event = null;
let editing_event = null;

function startPage() {
    let $main = $("#main-jumbotron");
    let result = '<p class="jumbo-info">Načítavam ...</p>';
    $main.html(result);
    getAllEvents().then(function(result) {
        let res = parseResponse(result);
        res.forEach(function(e) {
            events.add(new Event(e));
        });
        result = '<p class="jumbo-info"></p>';
        $main.html(result);
        listEvents();
    });
}

function listEvents(year) {
    let result = '';
    let current_year = new Date().getFullYear();
    if (year) current_year = year;
    result += '<h3 class="admin-events-title">Udalosti z roku ' + current_year + '</h3>';
    result += '<select class="admin-yr-select">';
    events.years().forEach(function(yr) {result += '<option value="' + yr + '">Rok ' + yr + '</option>';});
    result += '</select>';
    events.filterByYear(current_year).forEach(function(e) {result += generateOneEvent(e);});
    let $main = $("#main-jumbotron");
    $main.html(result);
    let $select = $("select.admin-yr-select");
    $select.val(current_year);
    $select.change(function(){yearChanged();});
}

function yearChanged() {
    listEvents(parseInt($("select.admin-yr-select").val()));
}

function generateOneEvent(e) {
    let result = '';
    let html_date = e.htmlStartDate() + " ";
    let title_class = "event-title";
    if (e.special) title_class += " special-event";
    result += '' +
        '<div class="row custom-row" id="cal-row-' + e.id + '">' +
        '<div class="col-lg-9 col-md-9 col-sm-9 custom-col">' +
        '<div class="' + title_class + '">' +
        '<button type="button" class="btn fa-button" id="' + e.id + '" onclick="editEvent(this);"><i class="fa fa-pencil"></i></button> ' +
        '<button type="button" class="btn fa-button" id="' + e.id + '" onclick="deleteEvent(this);"><i class="fa fa-trash"></i></button> ' +
        '<button data-toggle="collapse" data-target="#cal-row-div-' + e.id + '" class="event-btn event-btn-admin">' +
        html_date + '[' + e.htmlStartTime() + '] ' + e.title + '' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="col-lg-3 col-md-3 col-sm-3 custom-col">' + e.htmlTags2() + '</div>' +
        '</div>' +
        '<div id="cal-row-div-' + e.id + '" class="collapse"><div class="event-content">' + e.content + '</div></div>';
    return result;
}

function deleteEvent(item) {
    let e = events.get(parseInt($(item).prop("id")));
    let result = '<p>Naozaj chcete zmazať túto udalosť?</p>';
    result += e.title;
    $("#remove-modal-body").html(result);
    $("#remove-modal").modal("show");
    deleting_event = e;
}

function deleteEvent2() {
    events.remove(deleting_event);
    yearChanged();
    let temp = {id: deleting_event.id, remove: true};
    sendEvent(parsePostData(temp)).then(function(res) {
        console.log("deleted");
        deleting_event = null;
    });
}

function editEvent(item) {
    let e = events.get(parseInt($(item).prop("id")));
    editing_event = e;
    populateEditInputs();
    $("#edit-event").modal("show");
}

function editEventClicked() {
    addEventClicked("-edit");
}

function populateEditInputs() {
    let e = editing_event;
    $("#edit-event input").each(function(i, v){
        $(v).prop("checked", false);
        $(v).val("");
    });
    if (e.tags1 && e.tags1.length) e.tags1.split("|").forEach(function(t) {$("#input-checkbox-" + t + "-edit").prop("checked", true)});
    if (e.tags2 && e.tags2.length) e.tags2.split("|").forEach(function(t) {$("#input-checkbox-tag-" + t + "-edit").prop("checked", true)});
    if (e.tags3 && e.tags3.length) e.tags3.split("|").forEach(function(t) {$("#input-checkbox-area-" + t + "-edit").prop("checked", true)});
    if (e.tags4 && e.tags4.length) e.tags4.split("|").forEach(function(t) {$("#input-checkbox-form-" + t + "-edit").prop("checked", true)});
    if (e.special) $("#input-checkbox-edit-visibility-special").prop("checked", true);
    if (e.public) $("#input-checkbox-edit-visibility-public").prop("checked", true);
    if (e.content && e.content.length) $("#input-content-edit").val(e.content);
    else $("#input-content-edit").val("");
    if (e.title && e.title.length) $("#input-title-edit").val(e.title);
    let d = e.start_time;
    $("#datetimepicker1-edit").data("DateTimePicker").date(new Date(d.year, d.month, d.day, d.hour, d.minute));

}