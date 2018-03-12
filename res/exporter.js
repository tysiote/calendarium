function exportPressed() {
    let btn = $("#export-button");
    let html_res = '';
    let html_class1 = '';
    let html_class2 = '';
    if (exporting) {
        exporting = false;
        html_res = "Exportovať";
        html_class1 = 'btn-default';
        html_class2 = 'btn-danger';
    } else {
        exporting = true;
        html_res = "Zrušiť exportovanie";
        html_class1 = 'btn-danger';
        html_class2 = 'btn-default';
    }
    btn.html(html_res);
    btn.removeClass(html_class2);
    btn.addClass(html_class1);
    validateExportOptionsButtons();
    mainDateChanged(last_date);
}

function validateExportOptionsButtons() {
    let buttons = [];
    let count = 0;
    setTimeout(function() {
        $(".export-button-options").each(function(i, v) {buttons.push($(v));});
        $(".dummy-selector-class-checkbox").each(function(i, v) {if ($(v).prop("checked")) count++;});
        if (count) buttons.forEach(function(b) {b.prop("disabled", false);});
        else buttons.forEach(function(b) {b.prop("disabled", true);});
        console.log("CHECKING", buttons.length, count);
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
    let result = '' +
        '<table class="table">' +
            '<thead><tr><th>Čas</th><th>Udalosť</th>' + content_th + '<th>Kategória</th><th>Spôsob</th></tr></thead>' +
            '<tbody>';
    selected.forEach(function(r) {result += exportOneRow(parseInt(r.prop("id").split("-")[2]), content);});
    result += '' +
        '</tbody>' +
        '</table>';
    $("#export-preview-body").html(result);
    $("#export-preview").modal('show');
}

function exportOneRow(id, content) {
    let e = events.get(id);
    let result = '<tr><td>' + e.htmlStartTime() + '</td><td>' + e.title + '</td>';
    if (content) result += '<td>' + e.content + '</td>';
    let tags1 = e.tags1.split("|");
    let res = '';
    tags1.forEach(function(t) {res += translateTag(t.toLowerCase()) + ", ";});
    result += '<td>' + res.substring(0, res.length - 2) + '</td>';
    let tags2 = e.tags2.split("|");
    res = '';
    tags2.forEach(function(t) {res += translateTag(t.toLowerCase()) + ", ";});
    result += '<td>' + res.substring(0, res.length - 2) + '</td>';
    // result += '<td>' + customReplace(e.tags1, "|", ", ") + '</td><td>' + customReplace(e.tags2, "|", ", ") + '</td>';
    return result;
}
