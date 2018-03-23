function addNewEvent(data) {
    let temp = new Event(data);
    events.add(temp);
    console.log(temp);
    sendEvent(parsePostData(temp.exportToPost(true))).then(function(res) {
        console.log(res.status, res.id);
        if (!res.status) alert("Chyba na strane servera");
        else temp.id = res.id;
        $("#add-new-event button").each(function(i, v) {
            $(v).attr("disabled", false);
            $("#add-new-event").modal("hide");
        })
    });
}

function editExistingEvent(event) {
    sendEvent(parsePostData(event.exportToPost()));
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

    if (tag === "politics") return "Politika";
    if (tag === "justice") return "Justícia";
    if (tag === "economic") return "Ekonomika";
    if (tag === "sport") return "Šport";
    if (tag === "culture") return "Kultúra";
    if (tag === "area") return "Samospráva";
    if (tag === "anniversary") return "Výročie";

    if (tag === "press") return "Tl. beseda";
    if (tag === "briefing") return "Brífing";
    if (tag === "conference") return "Konferencia";
    if (tag === "fete") return "Slávnosť";
    if (tag === "congress") return "Snem";
    if (tag === "festival") return "Festival";
    if (tag === "event") return "Podujatie";

    if (tag === "public") return "Verejné";
    if (tag === "special") return "Špeciálna udalosť";

    return '';
}

function addEventClicked() {
    let $err = $("#input-new-error");
    $err.html("");
    let title = $("#input-title").val();
    let content = $("#input-content").val();
    let date = $("#input-date").val();
    let tags1 = {
        politics: $("#input-checkbox-politics").is(":checked"),
        justice: $("#input-checkbox-justice").is(":checked"),
        economic: $("#input-checkbox-economic").is(":checked"),
        sport: $("#input-checkbox-sport").is(":checked"),
        culture: $("#input-checkbox-culture").is(":checked"),
        local: $("#input-checkbox-local").is(":checked"),
        anniversary: $("#input-checkbox-anniversary").is(":checked"),
    };
    let tags2 = {
        text: $("#input-checkbox-tag-text").is(":checked"),
        video: $("#input-checkbox-tag-video").is(":checked"),
        audio: $("#input-checkbox-tag-audio").is(":checked"),
        photo: $("#input-checkbox-tag-photo").is(":checked"),
    };
    let tags3 = {
        ba: $("#input-checkbox-area-ba").is(":checked"),
        tt: $("#input-checkbox-area-tt").is(":checked"),
        tn: $("#input-checkbox-area-tn").is(":checked"),
        nr: $("#input-checkbox-area-nr").is(":checked"),
        bb: $("#input-checkbox-area-bb").is(":checked"),
        za: $("#input-checkbox-area-za").is(":checked"),
        po: $("#input-checkbox-area-po").is(":checked"),
        ke: $("#input-checkbox-area-ke").is(":checked"),
    };
    let tags4 = {
        press: $("#input-checkbox-form-press").is(":checked"),
        briefing: $("#input-checkbox-form-briefing").is(":checked"),
        conference: $("#input-checkbox-form-conference").is(":checked"),
        fete: $("#input-checkbox-form-fete").is(":checked"),
        congress: $("#input-checkbox-form-congress").is(":checked"),
        festival: $("#input-checkbox-form-festival").is(":checked"),
        event: $("#input-checkbox-form-event").is(":checked"),
    };
    let tags5 = {
        public: $("#input-checkbox-visibility-public").is(":checked"),
        special: $("#input-checkbox-visibility-special").is(":checked"),
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
        let temp_date = {};
        temp_date.year = parseInt(date.split(" ")[3]);
        temp_date.month = parseMonth(date.split(" ")[2]);
        temp_date.day = parseInt(date.split(" ")[1].substring(0, date.split(" ")[1].length - 1));
        temp_date.hour = parseInt(date.split(" ")[4].split(":")[0]);
        temp_date.minute = parseInt(date.split(" ")[4].split(":")[1]);
        temp.start_time = temp_date;
        addNewEvent(temp);
        console.log(tags5);
        console.log(temp);
        $("#add-new-event button").each(function(i, v) {$(v).attr("disabled", "true");})
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
