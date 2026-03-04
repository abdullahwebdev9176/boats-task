


const type_based_page = (condition) => {

    if(condition === 'new-boats-for-sale'){
        condition = 'New Model';
    }else if(condition === 'used-boats-for-sale'){
        condition = 'Used Model';
    }else if(condition === 'boats-for-sale'){
        condition = '';
    }

    return condition;
};

module.exports = {
    type_based_page
}