function exportPressed() {
    let btn = $("#export-button");
    let html_res = '';
    if (exporting) {
        exporting = false;
        html_res = "Export";
    } else {
        exporting = true;
        html_res = "Exportujem";
    }
    btn.html(html_res);
    mainDateChanged(last_date);
}