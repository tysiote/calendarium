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

    let result = '<div id="exporting-table"><table class="table table-striped"><thead><tr>';
    if (viewing_mode !== "day") result += '<th>Deň</th>';
    result += '<th>Čas</th><th>Udalosť</th>' + content_th + '<th>Spôsob</th></tr></thead><tbody>';
    selected.forEach(function(r) {result += exportOneRow(parseInt(r.prop("id").split("-")[2]), content, viewing_mode !== "day");});
    result += '</tbody></table></div>';
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
    let res = '';
    tags2.forEach(function(t) {res += translateTag(t.toLowerCase()) + ", ";});
    result += '<td>' + res.substring(0, res.length - 2) + '</td>';
    return result;
}

function exportRaw() {
    let selected = [];
    $(".dummy-selector-class-checkbox").each(function(i, v) {if ($(v).prop("checked")) selected.push($(v));});
    let result = "";
    if (viewing_mode === "day") {
        selected.forEach(function(r) {result += exportRawOneDaily(parseInt(r.prop("id").split("-")[2]));});
    } else {
        selected.forEach(function(r) {result += exportRawOneWeekly(parseInt(r.prop("id").split("-")[2]));});
    }
    result += "";
    fnExcelReport(result);
}

function exportRawOneDaily(id) {
    let e = events.get(id);
    let result = '';
    result += e.htmlStartDate() + "\t" + e.htmlStartTime().replace(":", ".") + "\t" + e.title + ". " + e.content + "\t" + e.htmlTags2(true) + '\n';
    return result;
}

function exportRawOneWeekly(id) {
    let e = events.get(id);
    let result = '';
    result += e.htmlStartDate() + "\t" + e.htmlStartTime().replace(":", ".") + "\t" + e.title + "\t" + e.content + "\n";
    return result;
}

function fnExcelReport(tab_text) {
    // let ua = window.navigator.userAgent;
    // let sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
    // return (sa);
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tab_text));
    element.setAttribute('download', "export.txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function printData(id) {
    let divToPrint = $("#" + id).html();
    let htmlToPrint = '';
    $.when($.get("bootstrap/css/bootstrap.min.css")).done(function(response) {
        // console.log(response);
        htmlToPrint = '<style type="text/css">' + response + '</style>' + divToPrint;
    });
    setTimeout(function() {
        let newWin= window.open("");
        newWin.document.write(htmlToPrint);
        newWin.print();
        newWin.close();
    }, 500);
}