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


let updateFilterStatus = false;

function wantToUpdateFilters(){
    updateFilterStatus = true;
}



function urlSync(returnParams = false) {
    const payload = getPayload();
    const params = new URLSearchParams();

    console.log('Abdullah params',params);

    if (payload.condition && payload.condition.length && !payload.condition.includes('All')) {
        params.set('condition', payload.condition.join(','));
    }

    if (payload.brand && payload.brand.length) {
        params.set('brand', payload.brand.join(','));
    }

    if (payload.series && payload.series.length) {
        params.set('series', payload.series.join(','));
    }

    if (payload.model && payload.model.length) {
        params.set('model', payload.model.join(','));
    }

    const minLengthDefault = parseInt($("#minVal").data("minlength")) || 0;
    const maxLengthDefault = parseInt($("#maxVal").data("maxlength")) || 100;
    if (payload.lengthRange.min !== minLengthDefault || payload.lengthRange.max !== maxLengthDefault) {
        params.set('length', `${payload.lengthRange.min}-${payload.lengthRange.max}`);
    }

    const minYearDefault = parseInt($("#minYearVal").data("minyear")) || 0;
    const maxYearDefault = parseInt($("#maxYearVal").data("maxyear")) || 100;
    if (payload.yearRange.min !== minYearDefault || payload.yearRange.max !== maxYearDefault) {
        params.set('year', `${payload.yearRange.min}-${payload.yearRange.max}`);
    }

    if (returnParams) {
        params.set('filter', 'true');
        return params;
    }

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function storeFiltrsInSessionStorage() {
    const payload = getPayload();
    sessionStorage.setItem('filters', JSON.stringify(payload));
    urlSync();
}

function loadFilters() {
    
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('condition') || params.has('brand') || params.has('series') || params.has('model') || params.has('length') || params.has('year')) {
        selectedCondition = params.get('condition') ? params.get('condition').split(',') : ['All'];
        selectedBrand = params.get('brand') ? params.get('brand').split(',') : [];
        selectedSeries = params.get('series') ? params.get('series').split(',') : [];
        selectedModel = params.get('model') ? params.get('model').split(',') : [];
        
        if (params.has('length')) {
            const range = params.get('length').split('-');
            selectedLengthRange = { min: parseInt(range[0]), max: parseInt(range[1]) };
        }
        
        if (params.has('year')) {
            const range = params.get('year').split('-');
            selectedYearRange = { min: parseInt(range[0]), max: parseInt(range[1]) };
        }
        return;
    }

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
if(window.location.search){
    fetchBoats();
}

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
    // wantToUpdateFilters();
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
    // wantToUpdateFilters();
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
    const pageUrl = window.location.pathname;
    const params = urlSync(true);
    
    try {
        const response = await fetch(`${pageUrl}?${params.toString()}`, {
            method: 'GET',
        });

        const data = await response.json();
        console.log('Filtered boats:', data);
        renderInventory(data.boats);

        if(updateFilterStatus){
            updateFilters(data.availableFilters);
            updateFilterStatus = false;
        }
        
        $('#boat-count').text(`${data.boatsCount} boats found`);
    } catch (error) {
        console.error('Error fetching boats:', error);
    }
}

function updateFilters(filters) {
    const seriesContainer = $('#series-list');
    const modelContainer = $('#model-list');
    // const brandContainer = $('#brand-list');
    // const conditionContainer = $('#conditions-list');

    seriesContainer.html('');
    modelContainer.html('');
    // brandContainer.html('');
    // conditionContainer.html('');

    console.log('filters', filters);

    const series = [...new Set(filters.map((items)=> items.series).filter((item)=> item !== ''))];
    const models = [...new Set(filters.map((items)=> items.model).filter((item)=> item !== ''))];
    // const brands = [...new Set(filters.map((items)=> items.brand).filter((item)=> item !== ''))];
    // const conditions = [...new Set(filters.map((items)=> items.condition).filter((item)=> item !== ''))];

    console.log('series', series);
    console.log('models', models);
    // console.log('brands', brands);
    // console.log('conditions', conditions);

    $.each(series, function (index, boat) {

        seriesContainer.append(`
            <label>
                <input type="checkbox" class="series-item" value="${boat}" onclick="handleboatClick(event)"> ${boat}
            </label>
        `);
    });

    $.each(models, function (index, model) {

        modelContainer.append(`
            <label>
                <input type="checkbox" class="model-item" value="${model}" onclick="handleModelClick(event)"> ${model}
            </label>
        `);
    });

    // $.each(conditions, function (index, condition) {

    //     conditionContainer.append(`
    //          <label>
    //             <input type="checkbox" class="condition-item" value="${condition}" onclick="handleConditionClick(event)"> ${condition}
    //         </label>
    //     `);
    // });

    // $.each(brands, function (index, brand) {

    //     brandContainer.append(`
    //         <label>
    //             <input type="checkbox" class="brand-item" value="${brand}" onclick="handleBrandClick(event)"> ${brand}  
    //         </label>
    //     `);
    // });
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

    const params = urlSync(true);
    const pageUrl = window.location.pathname;
    const currentPage = parseInt($('#load-more').attr('current-page')) || 1;

    params.set('loadMore', 'true');
    params.set('page', currentPage);
    params.set('filter', 'false')

    try {
        const response = await fetch(`${pageUrl}?${params.toString()}`, {
            method: 'GET'
        });

        const data = await response.json();

        console.log('Load more boats:', data.boats.length);

        renderInventory(data.boats, true);
        $('#load-more').attr('current-page', data.currentPage);

        if (data.boats.length < 12) {
            $('#load-more').hide();
        }

    } catch (error) {
        console.error('Error loading more boats:', error);
    }
}

let searchValue = '';
let sortValue = '';

async function boatSearch(sortValue, searchValue) {
    const response = await fetch(`/boat-search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchValue, sortValue })
    });

    const data = await response.json();
    $('#boatSearch').val('');

    renderInventory(data.boats);
    $('#boat-count').text(`${data.boatsCount} boats found`)
}
$('#boatSearch').on('keydown', async function (e) {

    if (e.key === 'Enter') {
        searchValue = $(this).val();
        console.log('Selected boat search option:', searchValue);

        await boatSearch(sortValue, searchValue);
    }

});

$('#sortBy').on('change', async function (e) {
    sortValue = $(this).val();
    console.log('Selected sort option:', sortValue);
    await boatSearch(sortValue, searchValue);
});