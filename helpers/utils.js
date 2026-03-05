
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

module.exports = {
    type_based_page,
    allowed_pages
}