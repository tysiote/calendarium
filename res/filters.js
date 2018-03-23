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
            '<div class="col-md-6 col-sm-6 col-lg-6">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Členenie</label>' +
                    '<div class="form-group" id="input-checkboxes">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-politics"><label for="input-checkbox2-politics" class="checkbox-inline">Politika</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-justice"><label for="input-checkbox2-justice" class="checkbox-inline">Justícia</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-economic"><label for="input-checkbox2-economic" class="checkbox-inline">Ekonomika</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-sport"><label for="input-checkbox2-sport" class="checkbox-inline">Šport</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-culture"><label for="input-checkbox2-culture" class="checkbox-inline">Kultúra</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-local"><label for="input-checkbox2-local" class="checkbox-inline">Samospráva</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-anniversary"><label for="input-checkbox2-anniversary" class="checkbox-inline">Výročie</label></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="col-md-6 col-sm-6 col-lg-6">' +
                '<div class="form-group">' +
                    '<label for="input-checkboxes">Kraj</label>' +
                    '<div class="form-group" id="input-checkboxes3">' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-ba"><label for="input-checkbox2-area-ba" class="checkbox-inline">Bratislavský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-tt"><label for="input-checkbox2-area-tt" class="checkbox-inline">Trnavský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-tn"><label for="input-checkbox2-area-tn" class="checkbox-inline">Trenčiansky kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-nr"><label for="input-checkbox2-area-nr" class="checkbox-inline">Nitriansky kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-bb"><label for="input-checkbox2-area-bb" class="checkbox-inline">Banskobystrický kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-za"><label for="input-checkbox2-area-za" class="checkbox-inline">Žilinský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-po"><label for="input-checkbox2-area-po" class="checkbox-inline">Prešovský kraj</label></div>' +
                        '<div class="checkbox checkbox-primary"><input type="checkbox" class="dummy-selector-class-checkbox2" value="" id="input-checkbox2-area-ke"><label for="input-checkbox2-area-ke" class="checkbox-inline">Košický kraj</label></div>' +
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
        areas: []
    };
    selected.forEach(function(v) {
        let val = $(v).prop("id").split("-");
        if (val.length === 3) active_filters.classes.push(val[2]);
        else active_filters.areas.push(val[3]);
    });
    active_filters.search = $("#search-input").val();
    if (active_filters.search.length === 0 && active_filters.classes.length === 0 && active_filters.areas.length === 0) result = "Momentálne nie sú aktívne žiadne filtre";
    else {
        let res = events.filters(events.get());
        result = "Vašim filtrom vyhovuje " + res.length + "/" + events.get().length + " výsledkov";
    }
    $("#filter-info").html(result);
}