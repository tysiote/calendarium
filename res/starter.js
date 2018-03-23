let events = new Events();
let exporting = false;
let last_date = null;
let active_filters = {
    search: "",
    classes: [],
    areas: []
};
let viewing_mode = "day";
let viewing_params = "";
let default_weeks = 5;
let default_months = 3;

function startPage() {
    let $main = $("#main-jumbotron");
    let result = '<p class="jumbo-info">Načítavam ...</p>';
    $main.html(result);
    getAllEvents().then(function(result) {
        let res = parseResponse(result);
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
        drawMain();
    });
}