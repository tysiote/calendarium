function addNewEvent(data, bulk) {
    if (bulk && bulk.length) {
        let temp;
        let temporary_temps = [];
        bulk.forEach(function(e) {
            temp = new Event(e);
            events.add(temp);
            temporary_temps.push(temp);
        });
        let bulks = temp.exportToPost(true);
        for (let i = 1; i < bulk.length + 1; i++) bulks['start_time' + i] = parseDate(bulk[i - 1].start_time, "encode");
        bulks = parsePostData(bulks);
        sendEvent(parsePostData({bulk: true, count: bulk.length, events: bulks})).then(function(res) {
            if (!res[0].status) alert("Chyba na strane servera");
            else {
                for (let i = 0; i < temporary_temps.length; i++) {
                    temporary_temps[i].id = res[i].id;
                    temporary_temps[i].added_date = res[i].added;
                    temporary_temps[i].recalculateDates();
                }
            }
            $("#add-new-event button").each(function(i, v) {$(v).attr("disabled", false);});
            $("#edit-event button").each(function(i, v) {$(v).attr("disabled", false);});
            $("#add-new-event").modal("hide");
            yearChanged();
        });
    } else {
        let temp = new Event(data);
        events.add(temp);
        sendEvent(parsePostData(temp.exportToPost(true))).then(function(res) {
            if (!res.status) alert("Chyba na strane servera");
            else {
                temp.id = res.id;
                temp.added_date = res.added;
                temp.recalculateDates();
            }
            $("#add-new-event button").each(function(i, v) {$(v).attr("disabled", false);});
            $("#edit-event button").each(function(i, v) {$(v).attr("disabled", false);});
            $("#add-new-event").modal("hide");
            yearChanged();
        });
    }
}

function editExistingEvent(data) {
    let id = editing_event.id;
    let temp = new Event(data);
    temp.id = id;
    events.update(temp);
    sendEvent(parsePostData(temp.exportToPost(false))).then(function(res) {
        if (!res.status) alert("Chyba na strane servera");
        temp.edited_date = res.edited;
        temp.recalculateDates();
        $("#add-new-event button").each(function(i, v) {$(v).attr("disabled", false);});
        $("#edit-event button").each(function(i, v) {$(v).attr("disabled", false);});
        $("#edit-event").modal("hide");
        yearChanged();
    });
    dates_active = 1;
}

function invokeCalendarClick() {
    let $el = $('#main-datepicker');
    $el.show();
    let starting_data = $el.data("DateTimePicker").date()._d.toString();
    mainDateChanged(starting_data.substring(0, 16));
}

function selectAll() {
    let unchecked = 0;
    let checked = 0;
    let checkboxes = [];
    $(".dummy-selector-class-checkbox").each(function (i, v) {
        checkboxes.push($(v));
        if ($(v).prop("checked")) checked++;
        else unchecked++;
    });
    checkboxes.forEach(function(b) {
        b.prop("checked", unchecked > 0);
    });
    $("#select-all-checkbox").prop("checked", unchecked === 0);
    validateExportOptionsButtons();
}

function translateTag(tag) {
    if (tag === "video") return "Video";
    if (tag === "text") return "Text";
    if (tag === "audio") return "Zvuk";
    if (tag === "photo") return "Foto";
    if (tag === "live") return "Live";

    if (tag === "politics") return "Politika";
    if (tag === "justice") return "Justícia";
    if (tag === "economic") return "Ekonomika";
    if (tag === "sport") return "Šport";
    if (tag === "culture") return "Kultúra";
    if (tag === "area") return "Samospráva";
    if (tag === "anniversary") return "Výročie";
    if (tag === "health") return "Zdravie";
    if (tag === "school") return "Školstvo";
    if (tag === "abroad") return "Zahraničie";

    if (tag === "press") return "Tl. beseda";
    if (tag === "briefing") return "Brífing";
    if (tag === "conference") return "Konferencia";
    if (tag === "fete") return "Slávnosť";
    if (tag === "congress") return "Snem";
    if (tag === "festival") return "Festival";
    if (tag === "event") return "Podujatie";
    if (tag === "meeting") return "Zasadnutie";

    if (tag === "public") return "Verejné";
    if (tag === "special") return "Špeciálna udalosť";

    if (tag === "default_sport") return "Všeobecný";
    if (tag === "football") return "Futbal";
    if (tag === "hockey") return "Hokej";
    if (tag === "tennis") return "Tenis";
    if (tag === "athletics") return "Atletika";
    if (tag === "ski") return "Lyžovanie";
    if (tag === "motor") return "Motorizmus";
    if (tag === "sport_press") return "Tlačová beseda";
    if (tag === "sport_conference") return "Konferencia";
    if (tag === "sport_competition") return "Súťaž";
    if (tag === "sport_league") return "Liga";
    if (tag === "sport_match") return "Zápas";
    if (tag === "sport_tournament") return "Turnaj";
    if (tag === "sport_championship") return "Majstrovstvá";
    if (tag === "sport_olympics") return "Olympiáda";

    return '';
}

function addEventClicked(edit) {
    if (!edit) edit = '';
    let $err = $("#input-new-error" + edit);
    $err.html("");
    let title = $("#input-title" + edit).val();
    let content = $("#input-content" + edit).val();
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
        public: $("#input-checkbox-visibility-public" + edit).is(":checked"),
        special: $("#input-checkbox-visibility-special" + edit).is(":checked"),
    };
    let temp = {};
    let error = "";
    if (!title.length) error = "Prosím vyplňte názov";
    if (!date.length) error = "Prosím zvoľte správny dátum a čas";
    if (!error.length) {
        temp = {
            title: title,
            content: content,
            special: tags5.special,
            public: tags5.public
        };
        let temp_tags = "";
        for (let key in tags1) if (tags1[key]) temp_tags += key + "|";
        temp.tags1 = temp_tags.substring(0, temp_tags.length - 1);
        temp_tags = "";
        for (let key in tags2) if (tags2[key]) temp_tags += key + "|";
        temp.tags2 = temp_tags.substring(0, temp_tags.length - 1);
        temp_tags = "";
        for (let key in tags3) if (tags3[key]) temp_tags += key + "|";
        temp.tags3 = temp_tags.substring(0, temp_tags.length - 1);
        temp_tags = "";
        for (let key in tags4) if (tags4[key]) temp_tags += key + "|";
        temp.tags4 = temp_tags.substring(0, temp_tags.length - 1);
        temp.start_time = parseStartTimeFromDate(date);
        if (edit && edit.length) editExistingEvent(temp);
        else {
            if (dates_active > 1) {
                let temps = [];
                temp.start_time = parseStartTimeFromDate($("#input-date").val());
                temps.push(temp);
                for (let i = 1; i < dates_active; i++) {
                    let t = Object.assign({}, temp);
                    t.start_time = parseStartTimeFromDate($("#input-date-" + (i + 1)).val());
                    temps.push(t);
                }
                addNewEvent(null, temps);
            } else addNewEvent(temp);
            moreDates(-dates_active);
            dates_active = 1;
        }
        $("#add-new-event button").each(function(i, v) {$(v).attr("disabled", "true");})
        $("#edit-new-event button").each(function(i, v) {$(v).attr("disabled", "true");})
    } else {
        $err.html(error);
    }
}

function customReplace(s1, s2, s3) {
    while (s1.indexOf(s2) !== -1) {
        s1 = s1.replace(s2, s3);
    }
    return s1;
}

function parseStartTimeFromDate(date) {
    let temp_date = {};
    temp_date.year = parseInt(date.split(" ")[3]);
    temp_date.month = parseMonth(date.split(" ")[2]);
    temp_date.day = parseInt(date.split(" ")[1].substring(0, date.split(" ")[1].length - 1));
    temp_date.hour = parseInt(date.split(" ")[4].split(":")[0]);
    temp_date.minute = parseInt(date.split(" ")[4].split(":")[1]);
    return temp_date;
}

function toPublicLink() {
    let loc = location.href.toString();
    window.open(loc.substring(0, loc.indexOf("set.html")), '_blank');
}

function toLogin() {
    let loc = location.href.toString();
    if (loc.indexOf("index.html") !== -1) window.location.replace(loc.substring(0, loc.indexOf("index.html")) + "/login.html");
    else location.href = loc + "/login.html";
}

function joinTags(input) {
    let result = '';
    for (let key in input) if (input[key]) result += key + "|";
    if (!result.length) return '';
    return result.substring(0, result.length - 1);
}