let events = new Events();
let exporting = false;
let last_date = null;
let active_filters = {
    search: "",
    classes: [],
    areas: [],
    forms: [],
    tags: [],
    sports: []
};
let viewing_mode = "day";
let viewing_params = "";
let default_weeks = 5;
let default_months = 3;
let LEVEL = 1;
let export_type = false;
let deleting_event = null;
let editing_event = null;
let sport_selected = false;
let area_selected = false;
let adding_data = null;
let loading_try = 0;
let dates_active = 1;
let export_max = 70;

function startPage() {
    let $main = $("#main-jumbotron");
    let result = '' +
        '<p class="jumbo-info">' +
            '<div class="progress">' +
                '<div id="loading-page" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%">' +
                    'Načítavam, prosím čakajte' +
                '</div>' +
            '</div>' +
        '</p>';
    $main.html(result);
    $(window).resize(function() {
        resizeWindow();
    });
    sendPostRequest({action: "get_events"}).then(function(result) {
        successfulStart(result);
    });
}

function successfulStart(result) {
    result = JSON.parse(result);
    if (result.status.code !== 11) toLogin();
    else {
        if (result["level"]) LEVEL = parseInt(result["level"]);
        let res = parseResponse(result.data);
        res.forEach(function(e) {
            events.add(new Event(e));
        });
        let $el = $('#main-datepicker');
        $el.datetimepicker({
            inline: true,
            keepOpen: true,
            format: 'LL',
            locale: 'sk'
        });
        $el.on("dp.change", function(e) {mainDateChanged(e.date._d.toString());});
        invokeCalendarClick();
    }
}

function resizeWindow() {
    $("body").height(window.innerHeight);
}

function resizeMain() {
    setTimeout(function() {
        let h = 180 + $("#main-jumbotron").height();
        if (h > window.innerHeight) $("#main").height(h);
    }, 600);
}