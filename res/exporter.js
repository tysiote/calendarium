function exportPressed() {
    exporting = !exporting;
    if (viewing_mode === "day") {
        validateExportOptionsButtons();
        mainDateChanged(last_date);
    } else {
        viewChanged(viewing_mode, viewing_params);
    }
}

function validateExportOptionsButtons() {
    let buttons = [];
    let count = 0;
    setTimeout(function() {
        $(".btn-sidebar-small").each(function(i, v) {buttons.push($(v));});
        $(".dummy-selector-class-checkbox").each(function(i, v) {if ($(v).prop("checked")) count++;});
        if (count) buttons.forEach(function(b) {b.prop("disabled", false);});
        else buttons.forEach(function(b) {b.prop("disabled", true);});
        if (viewing_mode === "month") $("#export-button-raw").hide();
    }, 400);
}

function exportMainPressed(content) {
    let selected = [];
    let content_th = '';
    if (content) content_th = '<th>Popis</th>';
    $(".dummy-selector-class-checkbox").each(function(i, v) {if ($(v).prop("checked")) selected.push($(v));});
    let page_header = '';
    $(".daily-event-title").each(function(i, v){page_header = "Export dňa " + $(v).html().substring(15, $(v).html().length);});
    $("#export-preview-header").html(page_header);

    let result = '<table class="table"><thead><tr>';
    if (viewing_mode !== "day") result += '<th>Deň</th>';
    result += '<th>Čas</th><th>Udalosť</th>' + content_th + '<th>Forma</th><th>Spôsob</th></tr></thead><tbody>';
    selected.forEach(function(r) {result += exportOneRow(parseInt(r.prop("id").split("-")[2]), content, viewing_mode !== "day");});
    result += '</tbody></table>';
    $("#export-preview-body").html(result);
    $("#export-preview").modal('show');
}

function exportOneRow(id, content, with_day) {
    let e = events.get(id);
    let result = '<tr>';
    if (with_day) result += '<td>' + e.htmlStartDate() + '</td>';
    result += '<td>' + e.htmlStartTime() + '</td><td>' + e.title + '</td>';
    if (content) result += '<td>' + e.content + '</td>';
    let tags2 = e.tags2.split("|");
    let tags3 = e.tags3.split("|");
    let res = '';
    tags3.forEach(function(t) {res += translateTag(t.toLowerCase()) + ", ";});
    result += '<td>' + res.substring(0, res.length - 2) + '</td>';
    res = '';
    tags2.forEach(function(t) {res += translateTag(t.toLowerCase()) + ", ";});
    result += '<td>' + res.substring(0, res.length - 2) + '</td>';
    // result += '<td>' + customReplace(e.tags1, "|", ", ") + '</td><td>' + customReplace(e.tags2, "|", ", ") + '</td>';
    return result;
}

function exportRaw() {
    let selected = [];
    $(".dummy-selector-class-checkbox").each(function(i, v) {if ($(v).prop("checked")) selected.push($(v));});
    let result = "<table><tbody>";
    if (viewing_mode === "day") {
        selected.forEach(function(r) {result += exportRawOneDaily(parseInt(r.prop("id").split("-")[2]));});
    } else {
        selected.forEach(function(r) {result += exportRawOneWeekly(parseInt(r.prop("id").split("-")[2]));});
    }
    result += "</tbody></table>";
    fnExcelReport(result);
}

function exportRawOneDaily(id) {
    let e = events.get(id);
    let result = '<tr>';
    result += '' +
        '<td>' + e.htmlStartTime().replace(":", ".") + '</td>' +
        '<td>' + e.title + ' --- ' + e.content + '</td>' +
        '<td>' + e.htmlTags2() + '</td>';
    result += '</tr>';
    return result;
}

function exportRawOneWeekly(id) {
    let e = events.get(id);
    let result = '<tr>';
    result += '' +
        '<td>' + e.start_time.day.toString() + '.' + parseMonthSlovak(e.start_time.month) + '</td>' +
        '<td>' + e.htmlStartTime().replace(":", ".") + '</td>' +
        '<td>' + e.title + ' --- ' + e.content + '</td>';
    result += '</tr>';
    return result;
}

function fnExcelReport(tab_text) {
    let ua = window.navigator.userAgent;
    let sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
    return (sa);
}