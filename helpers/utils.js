
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

const filtered_boats = async (result) => {

    const conditions = [...new Set(result.map(boat => boat.condition))];
    const brand = [...new Set(result.map(boat => boat.make))];
    const model = [...new Set(result.map(boat => boat.model))];
    const series = [...new Set(result.map(boat => boat.series))];
    
    return {
        conditions,
        brand,
        model,
        series
    }
}

module.exports = {
    type_based_page,
    allowed_pages,
    filtered_boats
}