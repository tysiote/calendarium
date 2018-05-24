function deleteEvent(item) {
    let e = events.get(parseInt($(item).prop("id")));
    let result = '<p>Naozaj chcete zmazať túto udalosť?</p>';
    result += e.title;
    $("#remove-modal-body").html(result);
    $("#remove-modal").modal("show");
    deleting_event = e;
}

function deleteEvent2() {
    let d = new Date();
    let temp = {action: "delete_event_soft", data: {id: deleting_event.id}};
    let soft = d.getFullYear() === deleting_event.start_time.year && d.getDate() === deleting_event.start_time.day && d.getMonth() + 1 === deleting_event.start_time.month;
    console.log(soft, d.getFullYear() === deleting_event.start_time.year, d.getDate() === deleting_event.start_time.day, d.getMonth() + 1 === deleting_event.start_time.month);
    console.log(d.getFullYear(), d.getDate(), d.getMonth() + 1);
    console.log(deleting_event);
    if (!soft) {
        events.remove(deleting_event);
        temp.action = "delete_event_hard";
    }
    sendPostRequest(temp).then(function(res) {
        res = JSON.parse(res);
        if (soft) {
            deleting_event.deleted_date = res.data.deleted;
            deleting_event.recalculateDates();
        }
        deleting_event = null;
        invokeCalendarClick();
        viewChanged(viewing_mode, viewing_params);
    });
}

function editEvent(item) {
    editing_event = events.get(parseInt($(item).prop("id")));
    populateEditInputs();
    $("#edit-event").modal("show");
}

function addEvent() {
    populateAddInputs();
    $("#add-event").modal("show");
}

function populateAddInputs() {
    $("#add-event input").each(function(i, v){
        $(v).prop("checked", false);
        $(v).val("");
    });
    hideSport();
    hideArea();
    moreDates(-dates_active);
    $("#input-content").val("");
}

function populateEditInputs() {
    let e = editing_event;
    if (e.tags1.indexOf("sport") === -1) hideSport();
    else showSport();
    if (e.tags3.indexOf("all") === -1) hideArea();
    else showArea();
    $("#edit-event input").each(function(i, v){
        $(v).prop("checked", false);
        $(v).val("");
    });
    if (e.tags1 && e.tags1.length) e.tags1.split("|").forEach(function(t) {$("#input-checkbox-" + t + "-edit").prop("checked", true)});
    if (e.tags2 && e.tags2.length) e.tags2.split("|").forEach(function(t) {$("#input-checkbox-tag-" + t + "-edit").prop("checked", true)});
    if (e.tags3 && e.tags3.length) e.tags3.split("|").forEach(function(t) {$("#input-checkbox-area-" + t + "-edit").prop("checked", true)});
    if (e.tags4 && e.tags4.length) e.tags4.split("|").forEach(function(t) {$("#input-checkbox-form-" + t + "-edit").prop("checked", true)});
    if (e.tags5 && e.tags5.length) e.tags5.split("|").forEach(function(t) {$("#input-checkbox-sport-" + t + "-edit").prop("checked", true)});
    if (e.sport_type && e.sport_type.length) e.sport_type.split("|").forEach(function(t) {$("#input-checkbox-sport-" + t + "-edit").prop("checked", true)});
    let content = customReplace(customReplace(e.content, "&nbsp;", " "), "<br>", "\n");
    let title = customReplace(customReplace(e.title, "&nbsp;", " "), "<br>", "\n");
    if (content && content.length) $("#input-content-edit").val(content);
    else $("#input-content-edit").val("");
    if (title && title.length) $("#input-title-edit").val(title);
    let d = e.start_time;
    $("#datetimepicker1-edit").data("DateTimePicker").date(new Date(d.year, d.month - 1, d.day, d.hour, d.minute));
}

function grabCheckboxes(edit) {
    if (edit) edit = "-edit";
    else edit = '';
    let err = '';
    let title = $("#input-title" + edit).val();
    let content = $("#input-content" + edit).val();
    while(content.length && content.substring(content.length - 1, content.length) === "\n") content = content.substring(0, content.length - 1);
    let date = $("#input-date" + edit).val();
    let tags1 = {
        politics: $("#input-checkbox-politics" + edit).is(":checked"),
        justice: $("#input-checkbox-justice" + edit).is(":checked"),
        economic: $("#input-checkbox-economic" + edit).is(":checked"),
        sport: $("#input-checkbox-sport" + edit).is(":checked"),
        culture: $("#input-checkbox-culture" + edit).is(":checked"),
        local: $("#input-checkbox-local" + edit).is(":checked"),
        anniversary: $("#input-checkbox-anniversary" + edit).is(":checked"),
        health: $("#input-checkbox-health" + edit).is(":checked"),
        school: $("#input-checkbox-school" + edit).is(":checked"),
        abroad: $("#input-checkbox-abroad" + edit).is(":checked"),
    };
    let tags2 = {
        text: $("#input-checkbox-tag-text" + edit).is(":checked"),
        video: $("#input-checkbox-tag-video" + edit).is(":checked"),
        audio: $("#input-checkbox-tag-audio" + edit).is(":checked"),
        photo: $("#input-checkbox-tag-photo" + edit).is(":checked"),
        live: $("#input-checkbox-tag-live" + edit).is(":checked"),
    };
    let tags3 = {
        ba: $("#input-checkbox-area-ba" + edit).is(":checked"),
        tt: $("#input-checkbox-area-tt" + edit).is(":checked"),
        tn: $("#input-checkbox-area-tn" + edit).is(":checked"),
        nr: $("#input-checkbox-area-nr" + edit).is(":checked"),
        bb: $("#input-checkbox-area-bb" + edit).is(":checked"),
        za: $("#input-checkbox-area-za" + edit).is(":checked"),
        po: $("#input-checkbox-area-po" + edit).is(":checked"),
        ke: $("#input-checkbox-area-ke" + edit).is(":checked"),
    };
    let tags4 = {
        press: $("#input-checkbox-form-press" + edit).is(":checked"),
        briefing: $("#input-checkbox-form-briefing" + edit).is(":checked"),
        conference: $("#input-checkbox-form-conference" + edit).is(":checked"),
        fete: $("#input-checkbox-form-fete" + edit).is(":checked"),
        congress: $("#input-checkbox-form-congress" + edit).is(":checked"),
        festival: $("#input-checkbox-form-festival" + edit).is(":checked"),
        event: $("#input-checkbox-form-event" + edit).is(":checked"),
        meeting: $("#input-checkbox-form-meeting" + edit).is(":checked"),
    };
    let tags5 = {
        sport_press: $("#input-checkbox-sport-sport_press" + edit).is(":checked"),
        sport_conference: $("#input-checkbox-sport-sport_conference" + edit).is(":checked"),
        sport_competition: $("#input-checkbox-sport-sport_competition" + edit).is(":checked"),
        sport_league: $("#input-checkbox-sport-sport_league" + edit).is(":checked"),
        sport_match: $("#input-checkbox-sport-sport_match" + edit).is(":checked"),
        sport_tournament: $("#input-checkbox-sport-sport_tournament" + edit).is(":checked"),
        sport_championship: $("#input-checkbox-sport-sport_championship" + edit).is(":checked"),
        sport_olympics: $("#input-checkbox-sport-sport_olympics" + edit).is(":checked"),
    };
    let sport_type = {
        default_sport: $("#input-checkbox-sport-default_sport" + edit).is(":checked"),
        football: $("#input-checkbox-sport-football" + edit).is(":checked"),
        hockey: $("#input-checkbox-sport-hockey" + edit).is(":checked"),
        tennis: $("#input-checkbox-sport-tennis" + edit).is(":checked"),
        athletics: $("#input-checkbox-sport-athletics" + edit).is(":checked"),
        ski: $("#input-checkbox-sport-ski" + edit).is(":checked"),
        motor: $("#input-checkbox-sport-motor" + edit).is(":checked"),
    };
    if (!title.length) err = "Prosím vyplňte názov";
    if (!date.length) err = "Prosím zvoľte správny dátum a čas";
    return {
        title: title,
        content: content,
        date: date,
        tags1: tags1,
        tags2: tags2,
        tags3: tags3,
        tags4: tags4,
        tags5: tags5,
        sport_type: sport_type,
        err: err
    }
}

function editEventBeforeSend(data, adding) {
    let e = editing_event;
    if (adding) {
        adding_data = {};
        e = adding_data;
    }
    if (data.err.length) return [false, data.err];
    e.title = data.title;
    e.content = data.content;
    e.start_time = parseStartTimeFromDate(data.date);
    e.tags1 = joinTags(data.tags1);
    e.tags2 = joinTags(data.tags2);
    e.tags3 = joinTags(data.tags3);
    e.tags4 = joinTags(data.tags4);
    e.tags5 = joinTags(data.tags5);
    e.sport_type = joinTags(data.sport_type);
    return [true];
}

function addEventSend() {
    let status = editEventBeforeSend(grabCheckboxes(), true);
    if (status[0]) {
        let temp = {action: "add_event", data: {}};
        temp.data.start_time = parseDate(adding_data.start_time, "encode");
        temp.data.content = adding_data.content;
        temp.data.title = adding_data.title;
        temp.data.tags1 = adding_data.tags1;
        temp.data.tags2 = adding_data.tags2;
        temp.data.tags3 = adding_data.tags3;
        temp.data.tags4 = adding_data.tags4;
        temp.data.tags5 = adding_data.tags5;
        temp.data.sport_type = adding_data.sport_type;
        let sending_obj = temp;
        if (dates_active > 1) {
            let temps = [temp];
            for (let i = 1; i < dates_active; i++) {
                let t = Object.assign({}, temp);
                t.data = Object.assign({}, temp.data);
                t.data.start_time = parseDate(parseStartTimeFromDate($("#input-date-" + (i + 1)).val()), "encode");
                temps.push(t);
            }
            sending_obj = {action: "add_event_bulk", data: temps};

        }
        let buttons = $("button", $("#add-event"));
        buttons.each(function() {$(this).prop("disabled", true);});
        sendPostRequest(sending_obj).then(function(res) {
            res = JSON.parse(res);
            buttons.each(function() {$(this).prop("disabled", false);});
            $("#add-event").modal("hide");
            if (dates_active > 1) {
                res.data.forEach(function(d) {
                    let e = parseResponse([d.data]);
                    let new_event = new Event(e[0]);
                    events.add(new_event);
                });
            } else {
                let e = parseResponse([res.data]);
                let new_event = new Event(e[0]);
                events.add(new_event);
            }
            invokeCalendarClick();
            viewChanged(viewing_mode, viewing_params);
        });
    } else $("#input-new-error").html(status[1]);
}

function editEventSend() {
    let status = editEventBeforeSend(grabCheckboxes(true));
    if (status[0]) {
        let temp = {action: "edit_event", data: {id: editing_event.id}};
        temp.data.start_time = parseDate(editing_event.start_time, "encode");
        temp.data.content = editing_event.content;
        temp.data.title = editing_event.title;
        temp.data.tags1 = editing_event.tags1;
        temp.data.tags2 = editing_event.tags2;
        temp.data.tags3 = editing_event.tags3;
        temp.data.tags4 = editing_event.tags4;
        temp.data.tags5 = editing_event.tags5;
        temp.data.sport_type = editing_event.sport_type;

        let buttons = $("button", $("#edit-event"));
        buttons.each(function() {$(this).prop("disabled", true);});
        sendPostRequest(temp).then(function(res) {
            res = JSON.parse(res);
            buttons.each(function() {$(this).prop("disabled", false);});
            $("#edit-event").modal("hide");
            editing_event.start_time = parseDate(res.data.start_time, "decode");
            editing_event.edited_date = res.data.edited;
            editing_event.recalculateDates();
            editing_event = null;
            viewChanged(viewing_mode, viewing_params);
        });
    } else $("#input-new-error-edit").html(status[1]);

}

function moreDates(inc) {
    let $controls = $("#dates-controls");
    let result = '';
    let old_values = [];
    if (inc > 0) {
        dates_active++;
        $controls.html('' +
            '<button type="button" class="btn btn-primary btn-date-option" onclick="moreDates(1);">Pridať deň</button>' +
            '<button type="button" class="btn btn-default btn-date-option" onclick="moreDates(-1);">Odobrať deň</button>'
        );
    } else {
        dates_active += inc;
        if (dates_active === 0) dates_active = 1;
        if (dates_active === 1) {
            $controls.html('<button type="button" class="btn btn-primary" onclick="moreDates(1);">Pridať deň</button>');
        }
    }
    for (let i = 1; i < dates_active; i++) {
        result += oneDate(i);
        old_values[i] = $("#input-date-" + (i + 1)).val();
    }
    $("#more-dates").html(result);
    for (let i = 1; i < dates_active; i++) {
        $(function () {$('#datetimepicker' + (i + 1)).datetimepicker({locale: 'sk', format: 'LLLL'});});
        if (old_values[i]) $("#input-date-" + (i + 1)).val(old_values[i]);
    }
}

function specialCheckboxes(el) {
    let $el = $(el);
    let id = $el.prop("id");
    if (id.indexOf("sport") !== -1) {
        if (sport_selected) hideSport();
        else showSport();

    } else if (id.indexOf("area") !== -1) {
        if (area_selected) hideArea();
        else showArea();
    }
}

function hideArea() {
    $('input', $("#input-checkboxes3-edit")).each(function() {
        if ($(this).prop("id").indexOf("all") === -1) {
            $(this).prop("disabled", false);
        }
    });
    $('input', $("#input-checkboxes3")).each(function() {
        if ($(this).prop("id").indexOf("all") === -1) {
            $(this).prop("disabled", false);
        }
    });
    area_selected = false;
}

function showArea() {
    $('input', $("#input-checkboxes3-edit")).each(function() {
        if ($(this).prop("id").indexOf("all") === -1) {
            $(this).prop("disabled", true);
            $(this).prop("checked", false);
        }
    });
    $('input', $("#input-checkboxes3")).each(function() {
        if ($(this).prop("id").indexOf("all") === -1) {
            $(this).prop("disabled", true);
            $(this).prop("checked", false);
        }
    });
    area_selected = true;
}

function hideSport() {
    $("#input-checkbox-sport_types-edit").hide();
    $("#input-checkbox-sport_types").hide();
    $('input', $("#input-checkboxes-edit")).each(function() {
        if ($(this).prop("id").indexOf("sport") === -1) {
            $(this).prop("disabled", false);
        }
    });
    $('input', $("#input-checkboxes")).each(function() {
        if ($(this).prop("id").indexOf("sport") === -1) {
            $(this).prop("disabled", false);
        }
    });
    sport_selected = false;
}

function showSport() {
    $("#input-checkbox-sport_types-edit").show();
    $("#input-checkbox-sport_types").show();
    $('input', $("#input-checkboxes-edit")).each(function() {
        if ($(this).prop("id").indexOf("sport") === -1) {
            $(this).prop("disabled", true);
            $(this).prop("checked", false);
        }
    });
    $('input', $("#input-checkboxes")).each(function() {
        if ($(this).prop("id").indexOf("sport") === -1) {
            $(this).prop("disabled", true);
            $(this).prop("checked", false);
        }
    });
    sport_selected = true;
}