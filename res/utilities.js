function addNewEvent(data) {
    let temp = new Event(data);
    events.add(temp);
    sendEvent(parsePostData(temp.exportToPost(true))).then(function(res) {
        console.log(res);
        $("#add-new-event button").each(function(i, v) {
            $(v).attr("disabled", false);
            $("#add-new-event").modal("hide");
        })
    });
}

function editExistingEvent(event) {
    sendEvent(parsePostData(event.exportToPost()));
}

function translateTag(tag) {
    if (tag === "video") return "Video";
    if (tag === "text") return "Text";
    if (tag === "audio") return "Zvuk";
    if (tag === "photo") return "Foto";
}

function addEventClicked() {
    let $err = $("#input-new-error");
    $err.html("");
    let title = $("#input-title").val();
    let content = $("#input-content").val();
    let date = $("#input-date").val();
    let tags1 = {
        home: $("#input-checkbox-home").is(":checked"),
        abroad: $("#input-checkbox-abroad").is(":checked"),
        economic: $("#input-checkbox-economic").is(":checked"),
        sport: $("#input-checkbox-sport").is(":checked"),
        photo: $("#input-checkbox-photo").is(":checked"),
        video: $("#input-checkbox-video").is(":checked"),
    };
    let tags2 = {
        text: $("#input-checkbox-tag-text").is(":checked"),
        video: $("#input-checkbox-tag-video").is(":checked"),
        audio: $("#input-checkbox-tag-audio").is(":checked"),
        photo: $("#input-checkbox-tag-photo").is(":checked"),
    };
    let temp = {};
    let error = "";
    if (!title.length) error = "Prosím vyplňte názov";
    if (!date.length) error = "Prosím zvoľte správny dátum a čas";
    if (!error.length) {
        temp = {
            title: title,
            content: content,
        };
        let temp_tags = "";
        for (let key in tags1) if (tags1[key]) temp_tags += key + "|";
        temp.tags1 = temp_tags.substring(0, temp_tags.length - 1);
        temp_tags = "";
        for (let key in tags2) if (tags2[key]) temp_tags += key + "|";
        temp.tags2 = temp_tags.substring(0, temp_tags.length - 1);
        let temp_date = {};
        temp_date.year = parseInt(date.split(" ")[3]);
        temp_date.month = parseMonth(date.split(" ")[2]);
        temp_date.day = parseInt(date.split(" ")[1].substring(0, date.split(" ")[1].length - 1));
        temp_date.hour = parseInt(date.split(" ")[4].split(":")[0]);
        temp_date.minute = parseInt(date.split(" ")[4].split(":")[1]);
        temp.start_time = temp_date;
        addNewEvent(temp);
        $("#add-new-event button").each(function(i, v) {$(v).attr("disabled", "true");})
    } else {
        $err.html(error);
    }
}