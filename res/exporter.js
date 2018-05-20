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

function exportMainPressed() {
    let selected = [];
    let content_th = '';
    if (export_type) content_th = '<th>Popis</th>';
    $(".dummy-selector-class-checkbox").each(function(i, v) {if ($(v).prop("checked")) selected.push($(v));});
    let page_header = $("#daily-header").html();
    page_header = "Export dňa " + page_header.substring(15, page_header.length);
    $("#export-preview-header").html(page_header);

    let result = '' +
        '<div class="export-controls">' +
            '<div class="checkbox checkbox-primary checkbox-inline row-checkbox">' +
                '<input type="checkbox" value="" id="export-content-check">' +
                '<label for="export-content-check" class="checkbox-inline" onclick="switchExports();">S popisom</label>' +
            '</div>' +
            '<button type="button" class="btn btn-primary" id="btn-export" onclick="exportTechnical();">Export</button>' +
        '</div>';
    result += '<div id="exporting-table"><table class="table table-striped"><thead><tr>';
    if (viewing_mode !== "day") result += '<th>Deň</th>';
    result += '<th>Čas</th><th>Udalosť</th>' + content_th + '<th>Spôsob</th></tr></thead><tbody id="export-body">';
    selected.forEach(function(r) {result += exportOneRow(parseInt(r.prop("id").split("-")[2]), export_type, viewing_mode !== "day");});
    result += '</tbody></table></div>';
    $("#export-preview-body").html(result);
    if (export_type) $("#export-content-check").prop("checked", true);
    if (LEVEL > 1 && viewing_mode === "day") $("#btn-export").show();
    $("#export-preview").modal('show');
}

function exportOneRow(id, content, with_day) {
    let e = events.get(id);
    let result = '<tr>';
    if (with_day) result += '<td>' + e.htmlStartDate() + '</td>';
    result += '<td>' + e.htmlStartTime() + '</td><td>' + e.title + '</td>';
    if (content) result += '<td>' + customReplace(e.content, "&nbsp;", " ") + '</td>';
    let tags2 = e.tags2.split("|");
    let res = '';
    tags2.forEach(function(t) {res += translateTag(t.toLowerCase()) + ", ";});
    result += '<td>' + res.substring(0, res.length - 2) + '</td>';
    return result;
}


function switchExports() {
    export_type += 1 - export_type*2;
    exportMainPressed();
}

function parseToExport(val) {
    let result = '';
    let word = '';
    let max = 70;
    let cur = 0;
    let i = 0;
    while (i < val.length) {
        if (cur < max) {
            if (val[i] === " " || val[i] === "\n") {
                if (cur + word.length + 1 < max) {
                    cur += word.length+1;
                    result += word + val[i];
                } else {
                    result += "\n" + word + " ";
                    cur = word.length + 1;
                }
                word = '';
            } else word += val[i];
        } else {
            result += "\n";
            cur = 0;
        }
        i++;
    }
    if (cur + word.length + 1 < max) result += word;
    else result += "\n" + word;
    result = customReplace(result, "\n", "<br>");
    return result;
}

function exportTechnical() {
    let text = $("#export-body").html();
    text = customReplace(text, "<table>", "");
    text = customReplace(text, "</table>", "");
    text = customReplace(text, "<tbody>", "");
    text = customReplace(text, "</tbody>", "");
    text = findTRs(text);
    text = customReplace(text, ":", ".");
    text = customReplace(text, " ", "&nbsp;");
    let winPrint = window.open('', '', 'left=0,top=0,width=1024,height=768,toolbar=0,scrollbars=1,status=0');
    winPrint.document.write('<title>Print  Report</title><div style="font-family: \'Courier New\'">' + text + '</div>');
    winPrint.document.close();
}

function findTRs(text) {
    let writing = false;
    let result = '';
    let temp = '';
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '<' && i < text.length - 4 && text[i+1] === 't' && text[i+2] === 'r' && text[i+3] === '>') {
            writing = true;
            i += 4;
        } else if (text[i] === '<' && i < text.length - 4 && text[i+1] === '/' && text[i+2] === 't' && text[i+3] === 'r' && text[i+4] === '>') {
            i += 4;
            writing = false;
            result += replaceTR(temp);
            temp = '';
        }
        if (writing) temp += text[i];
    }
    return result;
}

function replaceTR(tr) {
    let result = '';
    let tds = 0;
    let writing = false;
    let temp = '';
    for (let i = 0; i < tr.length; i++) {
        if (tr[i] === '<' && i < tr.length - 4 && tr[i+1] === 't' && tr[i+2] === 'd' && tr[i+3] === '>') {
            writing = true;
            tds++;
            i += 4;
        } else if (tr[i] === '<' && i < tr.length - 4 && tr[i+1] === '/' && tr[i+2] === 't' && tr[i+3] === 'd' && tr[i+4] === '>') {
            i += 4;
            writing = false;
            if (tds === 1 && temp.length === 4) temp = "0" + temp;
            if (tds === 1) result += customReplace(temp, ":", ".") + "&nbsp;".repeat(5);
            if (tds === 2) result += parseToExport(temp) + '<br>';
            if (tds === 3) result += parseToExport(temp) + "&nbsp;".repeat(5);
            if (tds === 4) result += temp;
            temp = '';
        }
        if (writing) temp += tr[i];
    }
    result = customReplace(result, "<br>", "<b2r>");
    result = customReplace(result, "<b2r>", "<br>" + "&nbsp;".repeat(10));
    return result + "<br><br><br>";
}