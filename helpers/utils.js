
const allowed_pages = ['new-boats-for-sale', 'used-boats-for-sale', 'boats-for-sale'];

const type_based_page = (type) => {
    switch (type) {
        case 'new-boats-for-sale':
            return { condition: 'New Model' };
        case 'used-boats-for-sale':
            return { condition: 'Pre-Owned' };
        default:
            return {};
    }
};

const applied_filters = (filters_body) => {

    const { condition, brand, model, series, minLength, maxLength, minYear, maxYear } = filters_body;

    let query = {};

    if (condition && condition.length && !condition.includes('All')) {
        query.condition = { $in: condition };
    }

    if (brand && brand.length) {
        query.brand = { $in: brand };
    }

    if (model && model.length) {
        query.model = { $in: model };
    }

    if (series && series.length) {
        query.series = { $in: series };
    }

    if (minLength !== undefined && maxLength !== undefined) {
        query.length = { $gte: minLength, $lte: maxLength };
    }

    if (minYear !== undefined && maxYear !== undefined) {
        query.year = { $gte: minYear, $lte: maxYear };
    }

    return query;
}

const filtered_boats = async (result) => {

    const conditions = [...new Set(result.map(boat => boat.condition))];
    const brand = [...new Set(result.map(boat => boat.brand.trim()))];
    const model = [...new Set(result.map(boat => boat.model.trim()))];
    const series = [...new Set(result.map(boat => boat.series.trim()))];
    const length = [...new Set(result.map(boat => boat.length))];
    const year = [...new Set(result.map(boat => boat.year))];

    const minLength = Math.min(...length);
    const maxLength = Math.max(...length);
    const minYear = Math.min(...year);
    const maxYear = Math.max(...year);

    return {
        conditions,
        brand,
        model,
        series,
        minLength,
        maxLength,
        minYear,
        maxYear
    }
}

const sortOptions = (sortValue) => {
    switch (sortValue) {
        case 'price_low_high':
            return { price: 1 };

        case 'price_high_low':
            return { price: -1 };

        case 'length_low_high':
            return { length: 1 };

        case 'length_high_low':
            return { length: -1 };

        default:
            return {};
    }
};

module.exports = {
    type_based_page,
    allowed_pages,
    filtered_boats,
    applied_filters,
    sortOptions
}