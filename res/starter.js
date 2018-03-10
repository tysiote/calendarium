let events = new Events();
let exporting = false;
let last_date = null;

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
        let starting_data = $el.data("DateTimePicker").date()._d.toString();
        mainDateChanged(starting_data.substring(0, 16));
        drawMain();
    });
}