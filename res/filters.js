function setFilters() {
    viewChanged(viewing_mode, viewing_params);
    $("#filters-modal").modal("hide");
}

function openFilters() {
    let result = '' +
        '<div class="search-div">' +
            '<input type="text" class="search-input" id="search-input" placeholder="Hľadaj udalosť" name="search">' +
        '</div>' +
        '<div class="row">' +
            '<div class="col-md-3 col-sm-3 col-lg-3">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Členenie</label>' +
                    '<div class="form-group" id="input-checkboxes-filter-1">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-politics"><label for="input-checkbox2-politics" class="checkbox-inline">Politika</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-justice"><label for="input-checkbox2-justice" class="checkbox-inline">Justícia</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-economic"><label for="input-checkbox2-economic" class="checkbox-inline">Ekonomika</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport"><label for="input-checkbox2-sport" class="checkbox-inline">Šport</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-culture"><label for="input-checkbox2-culture" class="checkbox-inline">Kultúra</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-local"><label for="input-checkbox2-local" class="checkbox-inline">Samospráva</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-anniversary"><label for="input-checkbox2-anniversary" class="checkbox-inline">Výročie</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-health"><label for="input-checkbox2-health" class="checkbox-inline">Zdravie</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-school"><label for="input-checkbox2-school" class="checkbox-inline">Školstvo</label></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-3 col-sm-3 col-lg-3">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Kraj</label>' +
                    '<div class="form-group" id="input-checkboxes-filter-2">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-ba"><label for="input-checkbox2-area-ba" class="checkbox-inline">Bratislavský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-tt"><label for="input-checkbox2-area-tt" class="checkbox-inline">Trnavský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-tn"><label for="input-checkbox2-area-tn" class="checkbox-inline">Trenčiansky kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-nr"><label for="input-checkbox2-area-nr" class="checkbox-inline">Nitriansky kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-bb"><label for="input-checkbox2-area-bb" class="checkbox-inline">Banskobystrický kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-za"><label for="input-checkbox2-area-za" class="checkbox-inline">Žilinský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-po"><label for="input-checkbox2-area-po" class="checkbox-inline">Prešovský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-ke"><label for="input-checkbox2-area-ke" class="checkbox-inline">Košický kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-all"><label for="input-checkbox2-area-all" class="checkbox-inline">Celoslovenské</label></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-3 col-sm-3 col-lg-3">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Forma</label>' +
                    '<div class="form-group" id="input-checkboxes-filter-3">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-press"><label for="input-checkbox2-type-form-press" class="checkbox-inline">Tlačová beseda</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-briefing"><label for="input-checkbox2-type-form-briefing" class="checkbox-inline">Brífing</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-conference"><label for="input-checkbox2-type-form-conference" class="checkbox-inline">Konferencia</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-fete"><label for="input-checkbox2-type-form-fete" class="checkbox-inline">Slávnosť</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-congress"><label for="input-checkbox2-type-form-congress" class="checkbox-inline">Snem</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-festival"><label for="input-checkbox2-type-form-festival" class="checkbox-inline">Festival</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-event"><label for="input-checkbox2-type-form-event" class="checkbox-inline">Podujatie</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-type-form-meeting"><label for="input-checkbox2-type-form-meeting" class="checkbox-inline">Zasadnutie</label></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-3 col-sm-3 col-lg-3">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Spôsob</label>' +
                    '<div class="form-group" id="input-checkboxes-filter-4">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-tag-tag-tag-text"><label for="input-checkbox2-tag-tag-tag-text" class="checkbox-inline">Text</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-tag-tag-tag-video"><label for="input-checkbox2-tag-tag-tag-video" class="checkbox-inline">Video</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-tag-tag-tag-audio"><label for="input-checkbox2-tag-tag-tag-audio" class="checkbox-inline">Zvuk</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-tag-tag-tag-photo"><label for="input-checkbox2-tag-tag-tag-photo" class="checkbox-inline">Photo</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-tag-tag-tag-live"><label for="input-checkbox2-tag-tag-tag-live" class="checkbox-inline">Live</label></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-3 col-sm-3 col-lg-3">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Šport</label>' +
                    '<div class="form-group" id="input-checkboxes-filter-5">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-default_sport"><label for="input-checkbox2-sport-sport-sport-sport-default_sport" class="checkbox-inline">Všeobecný</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-football"><label for="input-checkbox2-sport-sport-sport-sport-football" class="checkbox-inline">Futbal</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-hockey"><label for="input-checkbox2-sport-sport-sport-sport-hockey" class="checkbox-inline">Hokej</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-tennis"><label for="input-checkbox2-sport-sport-sport-sport-tennis" class="checkbox-inline">Tenis</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-athletics"><label for="input-checkbox2-sport-sport-sport-sport-athletics" class="checkbox-inline">Atletika</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-ski"><label for="input-checkbox2-sport-sport-sport-sport-ski" class="checkbox-inline">Lyžovanie</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport-sport-sport-sport-motor"><label for="input-checkbox2-sport-sport-sport-sport-motor" class="checkbox-inline">Motorizmus</label></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="filter-info" id="filter-info"></div>' +
    '';
    $("#filters-modal-body").html(result);

    $(".dummy-selector-class-checkbox2").each(function(i, v) {
        let val = $(v).prop("id").split("-");
        if (val.length === 3 && active_filters.classes.indexOf(val[2]) !== -1) $(v).prop("checked", true);
        if (val.length === 4 && active_filters.areas.indexOf(val[3]) !== -1) $(v).prop("checked", true);
        if (val.length === 5 && active_filters.forms.indexOf(val[4]) !== -1) $(v).prop("checked", true);
        if (val.length === 6 && active_filters.tags.indexOf(val[5]) !== -1) $(v).prop("checked", true);
        if (val.length === 7 && active_filters.sports.indexOf(val[6]) !== -1) $(v).prop("checked", true);
        $(v).change(function() {calculateFilters();});
    });
    $("#search-input").val(active_filters.search);
    $("#search-input").on("change paste keyup",function() {calculateFilters();});
    if (active_filters.search.length !== 0 || active_filters.classes.length !== 0 || active_filters.areas.length !== 0) calculateFilters();
    $("#filters-modal").modal("show");
}

function calculateFilters() {
    let selected = [];
    let result = '';
    $(".dummy-selector-class-checkbox2").each(function(i, v) {if ($(v).prop("checked")) selected.push($(v));});
    active_filters = {
        search: "",
        classes: [],
        areas: [],
        forms: [],
        tags: [],
        sports: []
    };
    selected.forEach(function(v) {
        let val = $(v).prop("id").split("-");
        if (val.length === 3) active_filters.classes.push(val[2]);
        if (val.length === 4) active_filters.areas.push(val[3]);
        if (val.length === 5) active_filters.forms.push(val[4]);
        if (val.length === 6) active_filters.tags.push(val[5]);
        if (val.length === 7) active_filters.sports.push(val[6]);
    });
    active_filters.search = $("#search-input").val();
    if (
        active_filters.search.length === 0 &&
        active_filters.classes.length === 0 &&
        active_filters.areas.length === 0 &&
        active_filters.forms.length === 0 &&
        active_filters.tags.length === 0 &&
        active_filters.sports.length === 0
    ) result = "Momentálne nie sú aktívne žiadne filtre";
    else {
        let res = events.filters(events.get());
        result = "Vašim filtrom vyhovuje " + res.length + "/" + events.get().length + " výsledkov";
    }
    $("#filter-info").html(result);
}