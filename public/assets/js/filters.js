let selectedCondition = ['All'];
let selectedBrand = [];
let selectedSeries = [];
let selectedModel = [];

let minLength = $("#minVal").data("minlength") || 0;
let maxLength = $("#maxVal").data("maxlength") || 100;
let minYear = $("#minYearVal").data("minyear") || 0;
let maxYear = $("#maxYearVal").data("maxyear") || 100;

let selectedLengthRange = { min: minLength, max: maxLength };
let selectedYearRange = { min: minYear, max: maxYear };

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
selectedFilters();

function selectedFilters() {

    let selectedItems = $('#selected-filters');
    let filterContnainer = $('#selected-filters-section');
    let filtersHTML = '';

    selectedCondition.forEach(condition => {
        filtersHTML += `
            <li data-type="condition" data-value="${condition}">
                <span>${condition}</span>
                <span class="fa fa-close close-filter"></span>
            </li>
        `;
        selectedCondition.forEach(condition => {
            $(`.condition-item[value="${condition}"]`).prop('checked', true);
        });

    });

    selectedBrand.forEach(brand => {
        filtersHTML += `
            <li data-type="brand" data-value="${brand}">
                <span>${brand}</span>
                <span class="fa fa-close close-filter"></span>
            </li>
        `;
        selectedBrand.forEach(brand => {
            $(`.brand-item[value="${brand}"]`).prop('checked', true);
        });

    });

    selectedModel.forEach(model => {
        filtersHTML += `
            <li data-type="model" data-value="${model}">
                <span>${model}</span>
                <span class="fa fa-close close-filter"></span>
            </li>
        `;
        selectedModel.forEach(model => {
            $(`.model-item[value="${model}"]`).prop('checked', true);
        });

    });

    selectedSeries.forEach(series => {
        filtersHTML += `
            <li data-type="series" data-value="${series}">
                <span>${series}</span>
                <span class="fa fa-close close-filter"></span>
            </li>
        `;
        selectedSeries.forEach(series => {
            $(`.series-item[value="${series}"]`).prop('checked', true);
        });

    });

    const minYearDefault = parseInt($("#minYearVal").data("minyear")) || 0;
    const maxYearDefault = parseInt($("#maxYearVal").data("maxyear")) || 100;

    if (selectedYearRange.min !== minYearDefault || selectedYearRange.max !== maxYearDefault) {
        filtersHTML += `
            <li data-type="year" data-value="${selectedYearRange.min}-${selectedYearRange.max}">
                <span>Year: ${selectedYearRange.min} - ${selectedYearRange.max}</span>
                <span class="fa fa-close close-filter"></span>
            </li>
        `;
    }

    const minLengthDefault = parseInt($("#minVal").data("minlength")) || 0;
    const maxLengthDefault = parseInt($("#maxVal").data("maxlength")) || 100;

    if (selectedLengthRange.min !== minLengthDefault) {
        console.log('Min Length changed:', selectedLengthRange.min);
        console.log('Default Min Length:', minLengthDefault);

    }

    if (selectedLengthRange.min !== minLengthDefault || selectedLengthRange.max !== maxLengthDefault) {
        filtersHTML += `
            <li data-type="length" data-value="${selectedLengthRange.min}-${selectedLengthRange.max}">
                <span>Length: ${selectedLengthRange.min} - ${selectedLengthRange.max}</span>
                <span class="fa fa-close close-filter"></span>
            </li>
        `;
    }

    if (filtersHTML) {
        selectedItems.html(filtersHTML);
        filterContnainer.show();
    } else {
        filterContnainer.hide();
    }

}

$('#selected-filters').on('click', '.close-filter', function () {

    console.log('Close filter clicked');
    const filterType = $(this).parent().data('type');
    const filterValue = $(this).parent().data('value');

    if (filterType === 'condition') {
        selectedCondition = selectedCondition.filter(value => value !== filterValue);
        $(`.condition-item[value="${filterValue}"]`).prop('checked', false);
    } else if (filterType === 'brand') {
        selectedBrand = selectedBrand.filter(value => value !== filterValue);
        $(`.brand-item[value="${filterValue}"]`).prop('checked', false);
    } else if (filterType === 'series') {
        selectedSeries = selectedSeries.filter(value => value !== filterValue);
        $(`.series-item[value="${filterValue}"]`).prop('checked', false);
    } else if (filterType === 'model') {
        selectedModel = selectedModel.filter(value => value !== filterValue);
        $(`.model-item[value="${filterValue}"]`).prop('checked', false);
    } else if (filterType === 'year') {
        selectedYearRange = { min: minYear, max: maxYear };
        $("#yearRangeSlider").slider('values', [minYear, maxYear]);
        $("#minYearVal").text(minYear);
        $("#maxYearVal").text(maxYear);
    } else if (filterType === 'length') {
        selectedLengthRange = { min: minLength, max: maxLength };
        $("#rangeSlider").slider('values', [minLength, maxLength]);
        $("#minVal").text(minLength);
        $("#maxVal").text(maxLength);
    }

    getPayload();
    storeFiltrsInSessionStorage();
    selectedFilters();
    fetchBoats();
});

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
    selectedFilters();
    fetchBoats();
}

function handleBrandClick(e) {

    const brandItems = $('.brand-item');

    selectedBrand = brandItems.filter(':checked').map(function () {
        return this.value;
    }).get();

    console.log(selectedBrand);
    getPayload();
    storeFiltrsInSessionStorage();
    selectedFilters();
    fetchBoats();
}

function handleSeriesClick(e) {

    const seriesItems = $('.series-item');

    selectedSeries = seriesItems.filter(':checked').map(function () {
        return this.value;
    }).get();

    console.log(selectedSeries);
    getPayload();
    storeFiltrsInSessionStorage();
    selectedFilters();
    fetchBoats();
}

function handleModelClick(e) {

    const modelItems = $('.model-item');

    selectedModel = modelItems.filter(':checked').map(function () {
        return this.value;
    }).get();

    console.log(selectedModel);
    getPayload();
    storeFiltrsInSessionStorage();
    selectedFilters();
    fetchBoats();
}

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
        selectedFilters();
        fetchBoats();
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
        selectedFilters();
        fetchBoats();
    }
});


async function fetchBoats() {
    const payload = getPayload();

    const pageUrl = window.location.pathname;
    try {
        const response = await fetch(`${pageUrl}?filter=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Filtered boats:', data.boats.length);
        renderInventory(data.boats);
        $('#boat-count').text(`${data.boatsCount} boats found`);
    } catch (error) {
        console.error('Error fetching boats:', error);
    }
}

function renderInventory(boats, append = false) {
    const boatContainer = $('#boat-listings');
    let boatCardHtml = '';

    $.each(boats, function (index, boat) {
        boatCardHtml += `
            <div class="col-lg-4 boat-card">
                <div class="boats-image">
                    <a href="/boat-details/${this._id}">
                        <img src="${this.product_images}" alt="${this.BoatTitle}">
                    </a>
                </div>
                <div class="boat-card-body">
                    <h3 class="boat-card-title"><a href="/boat-details/${this._id}">${this.BoatTitle}</a></h3>

                    <ul class="card-specs">
                        ${this.condition ? `<li class="specs-item">${this.condition}</li>` : ''}
                        ${this.length ? `<li class="specs-item">${this.length}' ft</li>` : ''}
                    </ul>

                    ${this.price ? `<p class="boat-card-price">Price: ${this.price}</p>` : '<p class="boat-card-price">Call For Price</p>'}
                </div>
            </div>
        `
    });

    if (append) {
        boatContainer.append(boatCardHtml);
    } else {
        boatContainer.html(boatCardHtml);
    }

}

async function loadMoreBoats() {

    const payload = getPayload();
    const pageUrl = window.location.pathname;
    const currentPage = parseInt($('#load-more').attr('current-page')) || 1;

    const response = await fetch(`${pageUrl}?loadMore=true&page=${currentPage}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log('Load more boats:', data.boats.length);

    renderInventory(data.boats, true);
    $('#load-more').attr('current-page', data.currentPage);

    if (data.boats.length < 12) {
        $('#load-more').hide();
    }
}

$('#boatSearch').on('keydown', async function(e){

    if (e.key === 'Enter') {

        const selectedValue = $(this).val();
        console.log('Selected boat search option:', selectedValue);

        const response = await fetch(`/boat-search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ search: selectedValue })
        });

        const data = await response.json();

        renderInventory(data.boats);
        $('#boat-count').text(`${data.boatsCount} boats found`);

    }

});