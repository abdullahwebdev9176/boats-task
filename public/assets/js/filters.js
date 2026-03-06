let selectedCondition = ['All'];
let selectedBrand = [];
let selectedSeries = [];
let selectedModel = [];
let selectedLengthRange = { min: 0, max: 100 };
let selectedYearRange = { min: 0, max: 100 };

function getPayload() {
    const payload = {
        condition: selectedCondition,
        brand: selectedBrand,
        series: selectedSeries,
        model: selectedModel,
        lengthRange: selectedLengthRange,
        yearRange: selectedYearRange
    };

    return payload;
}

function storeFiltrsInSessionStorage() {
    const payload = getPayload();
    sessionStorage.setItem('filters', JSON.stringify(payload));
}

function loadFilters() {
    const storedFilters = sessionStorage.getItem('filters');   
    if (storedFilters) {
        const filters = JSON.parse(storedFilters);
        selectedCondition = filters.condition || ['All'];
        selectedBrand = filters.brand || [];
        selectedSeries = filters.series || [];
        selectedModel = filters.model || [];
        selectedLengthRange = filters.lengthRange || { min: 0, max: 100 };
        selectedYearRange = filters.yearRange || { min: 0, max: 100 };
    }
}

loadFilters();

function handleConditionClick(e) {
    const clickedElement = $(e.target);
    const clickedValue = clickedElement.val();
    const items = $('.condition-item');
    const all = $('#condition-all');

    if (clickedValue === 'All') {

        items.prop('checked', false);
        all.prop('checked', true);
        selectedCondition = ['All'];
    } else {

        all.prop('checked', false);

        selectedCondition = items.filter(':checked').map(function () {
            return this.value;
        }).get();

        if (selectedCondition.length === 0) {
            selectedCondition = ['All'];
            all.prop('checked', true);
        }
    }

    console.log(selectedCondition);
    getPayload();
    storeFiltrsInSessionStorage();
}

function handleBrandClick(e) {

    const brandItems = $('.brand-item');

    selectedBrand = brandItems.filter(':checked').map(function () {
        return this.value;
    }).get();

    console.log(selectedBrand);
    getPayload();
    storeFiltrsInSessionStorage();
}

function handleSeriesClick(e) {

    const seriesItems = $('.series-item');

    selectedSeries = seriesItems.filter(':checked').map(function () {
        return this.value;
    }).get();

    console.log(selectedSeries);
    getPayload();
    storeFiltrsInSessionStorage();
}

function handleModelClick(e) {

    const modelItems = $('.model-item');

    selectedModel = modelItems.filter(':checked').map(function () {
        return this.value;
    }).get();

    console.log(selectedModel);
    getPayload();
    storeFiltrsInSessionStorage();
}

let minLength = $("#minVal").data("minlength") || 0;
let maxLength = $("#maxVal").data("maxlength") || 100;
let minYear = $("#minYearVal").data("minyear") || 0;
let maxYear = $("#maxYearVal").data("maxyear") || 100;

// console.log("Min Length:", minLength);
// console.log("Max Length:", maxLength);
// console.log("Min Year:", minYear);
// console.log("Max Year:", maxYear);

$("#rangeSlider").slider({
    range: true,
    min: minLength,
    max: maxLength,
    values: [minLength, maxLength],
    step: 1,

    slide: function (event, ui) {
        $("#minVal").text(ui.values[0]);
        $("#maxVal").text(ui.values[1]);

        selectedLengthRange = {
            min: ui.values[0],
            max: ui.values[1]
        }

        getPayload();
        storeFiltrsInSessionStorage();

    }
    
});

$("#yearRangeSlider").slider({
    range: true,
    min: minYear,
    max: maxYear,
    values: [minYear, maxYear],
    step: 1,

    slide: function (event, ui) {
        $("#minYearVal").text(ui.values[0]);
        $("#maxYearVal").text(ui.values[1]);

        console.log('Year Range:', ui.values[0], ui.values[1]);

        selectedYearRange = {
            min: ui.values[0],
            max: ui.values[1]
        }

        getPayload();
        storeFiltrsInSessionStorage();
    }
});